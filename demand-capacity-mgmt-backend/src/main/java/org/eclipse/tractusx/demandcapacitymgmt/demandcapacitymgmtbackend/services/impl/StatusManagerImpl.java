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
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusManager;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
@RequiredArgsConstructor
@Service
@Slf4j
public class StatusManagerImpl implements StatusManager {

    private final MaterialDemandRepository materialDemandRepository;
    private final CapacityGroupRepository capacityGroupRepository;
    private final StatusesRepository statusesRepository;
    private final UserRepository userRepository;
    private final LinkedCapacityGroupMaterialDemandRepository matchedDemandsRepository;
    private final LoggingHistoryRepository loggingRepository;

    private static final LocalDate TWO_WEEKS_FROM_NOW = LocalDate.now().plusWeeks(2);

    @Override
    public void calculateBottleneck(String userID, boolean postLog) {
        UserEntity user = getUser(userID).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<CapacityGroupEntity> capacityGroups = capacityGroupRepository.findByUserID(user.getId());

        int accumulatedImprovements = 0;
        int accumulatedDegradations = 0;

        for (CapacityGroupEntity cgs : capacityGroups) {
            EventType eventType = processCapacityGroup(userID, cgs, postLog);

            if (eventType == EventType.STATUS_IMPROVEMENT) {
                accumulatedImprovements++;
            } else if (eventType == EventType.STATUS_REDUCTION) {
                accumulatedDegradations++;
            }
        }

        updateAndLogStatus(userID, postLog, accumulatedImprovements, accumulatedDegradations);
    }

    private Optional<UserEntity> getUser(String userID) {
        return userRepository.findById(UUID.fromString(userID));
    }

    private Optional<StatusesEntity> getStatus(String userID) {
        return statusesRepository.findByUserID(UUID.fromString(userID));
    }

    private void updateAndLogStatus(String userID, boolean postLog, int improvements, int degradations) {
        StatusesEntity status = getStatus(userID).orElseGet(() -> createInitialStatus(userID));

        if (improvements > 0) {
            logEvent(EventType.STATUS_IMPROVEMENT, userID, postLog, "Status improved for " + improvements + " weeks", null);
        }
        if (degradations > 0) {
            logEvent(EventType.STATUS_REDUCTION, userID, postLog, "Status degraded for " + degradations + " weeks", null);
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

    private EventType processCapacityGroup(String userID, CapacityGroupEntity cgs, boolean postLog) {
        double aggregatedAverageDemand = calculateAggregatedAverageDemand(cgs);

        EventType eventType = determineEventType(cgs, aggregatedAverageDemand);
        cgs.setLinkStatus(eventType);
        capacityGroupRepository.save(cgs);
        logEvent(eventType, userID, postLog, null, cgs.getId());
        return eventType;
    }

    private double calculateAggregatedAverageDemand(CapacityGroupEntity cgs) {
        return matchedDemandsRepository.findByCapacityGroupID(cgs.getId()).stream()
                .map(entity -> materialDemandRepository.findById(entity.getMaterialDemandID()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .mapToDouble(demand -> calculateAverageDemand(demand.getDemandSeries()))
                .sum();
    }

    private double calculateAverageDemand(List<DemandSeries> matchedDemandSeries) {
        double totalDemand = matchedDemandSeries.stream()
                .flatMap(demand -> demand.getDemandSeriesValues().stream())
                .filter(value -> !value.getCalendarWeek().isBefore(TWO_WEEKS_FROM_NOW))
                .mapToDouble(DemandSeriesValues::getDemand)
                .sum();

        long count = matchedDemandSeries.stream()
                .flatMap(demand -> demand.getDemandSeriesValues().stream())
                .filter(value -> !value.getCalendarWeek().isBefore(TWO_WEEKS_FROM_NOW))
                .count();

        return count == 0 ? 0 : totalDemand / count;
    }

    private void logEvent(EventType eventType, String userID, boolean postLog, String descriptionOverride, UUID cgID) {
        if (!postLog) return;

        LoggingHistoryEntity logEntity = new LoggingHistoryEntity();
        logEntity.setObjectType(EventObjectType.CAPACITY_GROUP);
        Optional.ofNullable(cgID).ifPresent(logEntity::setCapacityGroupId);
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
