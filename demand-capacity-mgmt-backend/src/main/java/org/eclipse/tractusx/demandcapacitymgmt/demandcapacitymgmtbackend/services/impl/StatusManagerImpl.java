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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    @Override
    public void calculateBottleneck(String userID) {
        UserEntity user = getUser(userID);
        List<CapacityGroupEntity> capacityGroups = capacityGroupRepository.findByUserID(user.getId());

        int accumulatedImprovements = 0;
        int accumulatedDegradations = 0;

        for (CapacityGroupEntity cgs : capacityGroups) {
            EventType eventType = processCapacityGroup(userID, cgs);

            if (eventType == EventType.STATUS_IMPROVEMENT) {
                accumulatedImprovements++;
            } else if (eventType == EventType.STATUS_REDUCTION) {
                accumulatedDegradations++;
            }
        }
        StatusesEntity status = getStatus(userID);
        status.setStatusImprovementCount(accumulatedImprovements);
        status.setStatusDegradationCount(accumulatedDegradations);
        statusesRepository.save(status);
    }

    private EventType processCapacityGroup(String userID, CapacityGroupEntity cgs) {
        List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities = matchedDemandsRepository.findByCapacityGroupID(
            cgs.getId()
        );

        double aggregatedTotalDemand = 0.0;

        for (LinkedCapacityGroupMaterialDemandEntity entity : matchedEntities) {
            Optional<MaterialDemandEntity> materialDemand = materialDemandRepository.findById(
                entity.getMaterialDemandID()
            );
            if (materialDemand.isPresent()) {
                aggregatedTotalDemand += calculateTotalDemand(materialDemand.get().getDemandSeries());
            }
        }

        EventType eventType = determineEventType(cgs, aggregatedTotalDemand);
        cgs.setLinkStatus(eventType);
        capacityGroupRepository.save(cgs);
        logEvent(eventType, userID);
        return eventType;
    }

    private UserEntity getUser(String userID) {
        return userRepository
            .findById(UUID.fromString(userID))
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private StatusesEntity getStatus(String userID) {
        return statusesRepository
            .findByUserID(UUID.fromString(userID))
            .orElseGet(
                () -> {
                    StatusesEntity status = new StatusesEntity();
                    status.setUserID(UUID.fromString(userID));
                    status.setStatusImprovementCount(0);
                    status.setStatusDegradationCount(0);
                    statusesRepository.save(status);
                    return status;
                }
            );
    }

    private double calculateTotalDemand(List<DemandSeries> matchedDemandSeries) {
        return matchedDemandSeries
            .stream()
            .flatMap(demand -> demand.getDemandSeriesValues().stream())
            .mapToDouble(DemandSeriesValues::getDemand)
            .sum();
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

    private void logEvent(EventType eventType, String userID) {
        LoggingHistoryEntity logEntity = new LoggingHistoryEntity();
        logEntity.setObjectType(EventObjectType.CAPACITY_GROUP);
        logEntity.setEventType(eventType);
        logEntity.setUserAccount(getUser(userID).getUsername());
        logEntity.setTime_created(Timestamp.valueOf(LocalDateTime.now()));
        logEntity.setLogID(UUID.randomUUID());

        switch (eventType) {
            case STATUS_IMPROVEMENT:
                logEntity.setDescription("Status improvement");
                break;
            case STATUS_REDUCTION:
                logEntity.setDescription("Status degradation");
                break;
            default:
                return;
        }

        loggingRepository.save(logEntity);
    }
}
