/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * *******************************************************************************
 */

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusManager;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class StatusManagerImpl implements StatusManager {

    private static final LocalDate TWO_WEEKS_FROM_NOW = LocalDate.now().plusWeeks(2);
    private final MaterialDemandRepository materialDemandRepository;
    private final CapacityGroupRepository capacityGroupRepository;
    private final StatusesRepository statusesRepository;
    private final UserRepository userRepository;
    private final LinkedCapacityGroupMaterialDemandRepository matchedDemandsRepository;
    private final LoggingHistoryRepository loggingRepository;

    @Override
    public void calculateTodos(String userID) {
        userRepository
                .findById(UUID.fromString(userID))
                .ifPresent(
                        user -> {
                            List<MaterialDemandEntity> demands = fetchDemandsBasedOnRole(user, userID);

                            StatusesEntity statusesEntity = statusesRepository
                                    .findByUserID(UUID.fromString(userID))
                                    .orElseGet(() -> generateNewEntity(userID));

                            statusesEntity.setTodosCount(demands.size());
                            statusesRepository.save(statusesEntity);
                        }
                );
    }

    private StatusesEntity generateNewEntity(String userID) {
        return StatusesEntity.builder().userID(UUID.fromString(userID)).build();
    }

    private List<MaterialDemandEntity> fetchDemandsBasedOnRole(UserEntity user, String userID) {
        List<MaterialDemandEntity> demands = new ArrayList<>();

        if (user.getRole().equals(Role.CUSTOMER)) {
            demands = materialDemandRepository.findByCustomerId_Id(UUID.fromString(userID))
                    .stream()
                    .filter(d -> d.getDemandSeries().stream().allMatch(series -> series.getDemandSeriesValues().stream().allMatch(value -> value.getDemand() == 0)))
                    .collect(Collectors.toList());
        } else if (user.getRole().equals(Role.SUPPLIER)) {
            demands = materialDemandRepository.findBySupplierId_Id(UUID.fromString(userID))
                    .stream()
                    .filter(d -> d.getLinkStatus() == EventType.UN_LINKED)
                    .collect(Collectors.toList());
        }
        return demands;
    }


    @Override
    public void calculateBottleneck(String userID, boolean postLog) {
        UserEntity user = getUser(userID).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<CapacityGroupEntity> capacityGroups = capacityGroupRepository.findByUserID(user.getId());

        int accumulatedImprovements = 0;
        int accumulatedDegradations = 0;

        for (CapacityGroupEntity cgs : capacityGroups) {
            Pair<Integer, Integer> weeklyResults = processCapacityGroup(userID, cgs, postLog);
            accumulatedImprovements += weeklyResults.getKey();
            accumulatedDegradations += weeklyResults.getValue();

            updateAndLogStatus(userID, postLog, accumulatedImprovements, accumulatedDegradations, cgs.getId());
        }
    }

    private Optional<UserEntity> getUser(String userID) {
        return userRepository.findById(UUID.fromString(userID));
    }

    private Optional<StatusesEntity> getStatus(String userID) {
        return statusesRepository.findByUserID(UUID.fromString(userID));
    }

    private void updateAndLogStatus(String userID, boolean postLog, int improvements, int degradations, UUID cgID) {
        StatusesEntity status = getStatus(userID).orElseGet(() -> createInitialStatus(userID));

        if (improvements > 0) {
            logEvent(
                    EventType.STATUS_IMPROVEMENT,
                    userID,
                    postLog,
                    "Status improved for " + improvements + " weeks",
                    cgID
            );
        }
        if (degradations > 0) {
            logEvent(
                    EventType.STATUS_REDUCTION,
                    userID,
                    postLog,
                    "Status degraded for " + degradations + " weeks",
                    cgID
            );
        }

        status.setStatusImprovementCount(improvements);
        status.setStatusDegradationCount(degradations);
        statusesRepository.save(status);
    }

    private StatusesEntity createInitialStatus(String userID) {
        StatusesEntity status = new StatusesEntity();
        status.setUserID(UUID.fromString(userID));
        status.setStatusImprovementCount(0);
        status.setStatusDegradationCount(0);
        statusesRepository.save(status);
        return status;
    }

    private Pair<Integer, Integer> processCapacityGroup(String userID, CapacityGroupEntity cgs, boolean postLog) {
        List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities = matchedDemandsRepository.findByCapacityGroupID(
                cgs.getId()
        );

        int weeklyImprovements = 0;
        int weeklyDegradations = 0;

        boolean hasDegradation = false;

        for (LinkedCapacityGroupMaterialDemandEntity entity : matchedEntities) {
            Optional<MaterialDemandEntity> materialDemand = materialDemandRepository.findById(
                    entity.getMaterialDemandID()
            );
            if (materialDemand.isPresent()) {
                Map<LocalDate, Double> weeklyDemands = getWeeklyDemands(materialDemand.get().getDemandSeries());
                for (Map.Entry<LocalDate, Double> entry : weeklyDemands.entrySet()) {
                    EventType eventType = determineEventType(cgs, entry.getValue());

                    if (eventType == EventType.STATUS_REDUCTION) {
                        hasDegradation = true; // Flag if there's a degradation
                        weeklyDegradations++;
                    } else if (eventType == EventType.STATUS_IMPROVEMENT) {
                        weeklyImprovements++;
                    }

                    logEvent(eventType, userID, postLog, null, cgs.getId()); // Log each week's event
                }
            }
        }

        // Set the Capacity Group's status
        if (hasDegradation) {
            cgs.setLinkStatus(EventType.STATUS_REDUCTION);
        } else {
            cgs.setLinkStatus(EventType.STATUS_IMPROVEMENT);
        }
        capacityGroupRepository.save(cgs);

        return Pair.of(weeklyImprovements, weeklyDegradations);
    }

    private Map<LocalDate, Double> getWeeklyDemands(List<DemandSeries> matchedDemandSeries) {
        return matchedDemandSeries
                .stream()
                .flatMap(demand -> demand.getDemandSeriesValues().stream())
                .filter(value -> !value.getCalendarWeek().isBefore(TWO_WEEKS_FROM_NOW))
                .collect(
                        Collectors.groupingBy(
                                DemandSeriesValues::getCalendarWeek,
                                Collectors.summingDouble(DemandSeriesValues::getDemand)
                        )
                );
    }

    private void logEvent(EventType eventType, String userID, boolean postLog, String descriptionOverride, UUID cgID) {
        if (!postLog) return;

        LoggingHistoryEntity logEntity = new LoggingHistoryEntity();
        logEntity.setObjectType(EventObjectType.CAPACITY_GROUP);
        logEntity.setCapacityGroupId(cgID);
        logEntity.setEventType(eventType);
        logEntity.setUserAccount(getUser(userID).map(UserEntity::getUsername).orElse("Unknown"));
        logEntity.setTime_created(Timestamp.valueOf(LocalDateTime.now()));
        logEntity.setLogID(UUID.randomUUID());

        logEntity.setDescription(
                Optional.ofNullable(descriptionOverride).orElseGet(() -> getEventDescription(eventType))
        );
        if (logEntity.getDescription() != null) {
            loggingRepository.save(logEntity);
        }
    }

    private String getEventDescription(EventType eventType) {
        Map<EventType, String> descriptions = new HashMap<>();
        descriptions.put(EventType.STATUS_IMPROVEMENT, "Status improvement");
        descriptions.put(EventType.STATUS_REDUCTION, "Status degradation");
        return descriptions.get(eventType);
    }

    private EventType determineEventType(CapacityGroupEntity capacityGroup, double totalDemand) {
        double actualCapacity = capacityGroup.getDefaultActualCapacity();
        double maxCapacity = capacityGroup.getDefaultMaximumCapacity();

        if (totalDemand > maxCapacity || (maxCapacity == 0 && totalDemand > actualCapacity)) {
            return EventType.STATUS_REDUCTION;
        } else if (totalDemand == actualCapacity && actualCapacity == maxCapacity) {
            return EventType.GENERAL_EVENT;
        } else if (totalDemand <= actualCapacity) {
            return EventType.STATUS_IMPROVEMENT;
        } else {
            return EventType.GENERAL_EVENT;
        }
    }
}
