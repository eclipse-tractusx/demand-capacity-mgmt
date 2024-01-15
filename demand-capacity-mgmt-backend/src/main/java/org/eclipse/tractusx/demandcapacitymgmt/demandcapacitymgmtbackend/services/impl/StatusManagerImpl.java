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

    private void processUserTodos(UserEntity user, String userID) {
        List<MaterialDemandEntity> demands = fetchDemandsBasedOnRole(user,userID);
        StatusesEntity statusesEntity = getStatusEntity(userID);
        updateTodosCount(statusesEntity, demands.size());
    }

    private List<MaterialDemandEntity> fetchDemandsBasedOnRole(UserEntity user, String userID) {
        List<MaterialDemandEntity> demands = new ArrayList<>();

        if (user.getRole().equals(Role.CUSTOMER)) {
            demands =
                materialDemandRepository
                    .findAll() //TODO SUPPLIER AQUI findbysupplierID
                    .stream()
                    .filter(
                        d ->
                            d
                                .getDemandSeries()
                                .stream()
                                .allMatch(
                                    series ->
                                        series
                                            .getDemandSeriesValues()
                                            .stream()
                                            .allMatch(value -> value.getDemand() == 0)
                                )
                    )
                    .collect(Collectors.toList());
        } else if (user.getRole().equals(Role.SUPPLIER)) {
            demands =
                materialDemandRepository
                    .findAll() //TODO CUSTOMER AQUI findbycustomerID
                    .stream()
                    .filter(d -> d.getLinkStatus() == EventType.UN_LINKED)
                    .collect(Collectors.toList());
        }
        return demands;
    }

    private StatusesEntity getStatusEntity(String userID) {
        return statusesRepository.findByUserID(UUID.fromString(userID))
                .orElseGet(() -> generateNewEntity(userID));
    }

    private StatusesEntity generateNewEntity(String userID) {
        return StatusesEntity.builder().userID(UUID.fromString(userID)).build();
    }

    private void updateTodosCount(StatusesEntity statusesEntity, int count) {
        statusesEntity.setTodosCount(count);
        statusesRepository.save(statusesEntity);
    }


    @Override
    public void calculateBottleneck(String userID, boolean postLog) {
        UserEntity user = getUser(userID).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<CapacityGroupEntity> capacityGroups = capacityGroupRepository.findByUserID(user.getId());

        for (CapacityGroupEntity cgs : capacityGroups) {
            Pair<Integer, Integer> weeklyResults = processCapacityGroup(userID, cgs, postLog);
            updateAndLogStatus(userID, postLog, weeklyResults, cgs.getId());
        }
    }

    private Optional<UserEntity> getUser(String userID) {
        return userRepository.findById(UUID.fromString(userID));
    }

    private void updateAndLogStatus(String userID, boolean postLog, Pair<Integer, Integer> weeklyResults, UUID cgID) {
        int improvements = weeklyResults.getKey();
        int degradations = weeklyResults.getValue();

        StatusesEntity status = getStatus(userID).orElseGet(() -> createInitialStatus(userID));
        status.setStatusImprovementCount(improvements);
        status.setStatusDegradationCount(degradations);
        statusesRepository.save(status);

        logImprovementsAndDegradations(userID, postLog, improvements, degradations, cgID);
    }

    private Optional<StatusesEntity> getStatus(String userID) {
        return statusesRepository.findByUserID(UUID.fromString(userID));
    }

    private void logImprovementsAndDegradations(String userID, boolean postLog, int improvements, int degradations, UUID cgID) {
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
    }

    private Pair<Integer, Integer> processCapacityGroup(String userID, CapacityGroupEntity cgs, boolean postLog) {
        List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities = matchedDemandsRepository.findByCapacityGroupID(
            cgs.getId()
        );

        int weeklyImprovements = 0;
        int weeklyDegradations = 0;

        for (LinkedCapacityGroupMaterialDemandEntity entity : matchedEntities) {
            Pair<Integer, Integer> results = processEachDemandEntity(entity, userID, cgs, postLog);
            weeklyImprovements += results.getKey();
            weeklyDegradations += results.getValue();
        }

        updateCapacityGroupStatus(cgs, weeklyImprovements, weeklyDegradations);
        return Pair.of(weeklyImprovements, weeklyDegradations);
    }

    private Pair<Integer, Integer> processEachDemandEntity(LinkedCapacityGroupMaterialDemandEntity entity, String userID, CapacityGroupEntity cgs, boolean postLog) {
        int improvements = 0;
        int degradations = 0;

        Optional<MaterialDemandEntity> materialDemandOpt = materialDemandRepository.findById(entity.getMaterialDemandID());
        if (materialDemandOpt.isPresent()) {
            MaterialDemandEntity materialDemand = materialDemandOpt.get();

            for (DemandSeries demandSeries : materialDemand.getDemandSeries()) {
                Pair<Integer, Integer> demandSeriesResults = processDemandSeries(demandSeries, cgs, userID, postLog);
                improvements += demandSeriesResults.getKey();
                degradations += demandSeriesResults.getValue();
            }
        }

        return Pair.of(improvements, degradations);
    }

    private Pair<Integer, Integer> processDemandSeries(DemandSeries demandSeries, CapacityGroupEntity cgs, String userID, boolean postLog) {
        int improvements = 0;
        int degradations = 0;

        Map<LocalDate, Double> weeklyDemands = getWeeklyDemands(Collections.singletonList(demandSeries));

        for (Map.Entry<LocalDate, Double> entry : weeklyDemands.entrySet()) {
            LocalDate week = entry.getKey();
            Double demand = entry.getValue();

            EventType eventType = determineEventType(cgs, demand);

            if (eventType == EventType.STATUS_REDUCTION) {
                degradations++;
            } else if (eventType == EventType.STATUS_IMPROVEMENT) {
                improvements++;
            }

            if (postLog) {
                logEvent(eventType, userID, true, null, cgs.getId());
            }
        }

        return Pair.of(improvements, degradations);
    }

    private void updateCapacityGroupStatus(CapacityGroupEntity cgs, int weeklyImprovements, int weeklyDegradations) {
        if (weeklyDegradations > 0) {
            cgs.setLinkStatus(EventType.STATUS_REDUCTION);
        } else if (weeklyImprovements > 0) {
            cgs.setLinkStatus(EventType.STATUS_IMPROVEMENT);
        } else {
            cgs.setLinkStatus(EventType.GENERAL_EVENT);
        }
        capacityGroupRepository.save(cgs);
    }

    private Map<LocalDate, Double> getWeeklyDemands(List<DemandSeries> matchedDemandSeries) {
        return matchedDemandSeries.stream()
                .flatMap(demand -> demand.getDemandSeriesValues().stream())
                .filter(value -> !value.getCalendarWeek().isBefore(TWO_WEEKS_FROM_NOW))
                .collect(Collectors.groupingBy(DemandSeriesValues::getCalendarWeek, Collectors.summingDouble(DemandSeriesValues::getDemand)));
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
        logEntity.setDescription(Optional.ofNullable(descriptionOverride).orElseGet(() -> getEventDescription(eventType)));

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

        if (totalDemand > actualCapacity) {
            return EventType.STATUS_REDUCTION;
        } else if (totalDemand < actualCapacity) {
            return EventType.STATUS_IMPROVEMENT;
        } else { // totalDemand == actualCapacity
            return EventType.GENERAL_EVENT;
        }
    }

    private StatusesEntity createInitialStatus(String userID) {
        StatusesEntity status = new StatusesEntity();
        status.setUserID(UUID.fromString(userID));
        status.setStatusImprovementCount(0);
        status.setStatusDegradationCount(0);
        statusesRepository.save(status);
        return status;
    }
}
