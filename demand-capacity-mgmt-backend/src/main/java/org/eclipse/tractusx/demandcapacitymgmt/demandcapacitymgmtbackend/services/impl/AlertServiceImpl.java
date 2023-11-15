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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.AlertRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.AlertResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.TriggeredAlertRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.TriggeredAlertResponse;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.AlertThresholdType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.AlertsMonitoredObjects;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.AlertsRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.TriggeredAlertsRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.AlertService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Lazy
@RequiredArgsConstructor
@Service
@Slf4j
public class AlertServiceImpl implements AlertService {

    private final AlertsRepository alertsRepository;
    private final TriggeredAlertsRepository triggeredAlertsRepository;

    @Override
    public AlertResponse configureAlert(AlertRequest alertRequest) {
        AlertEntity alertEntity = convertDtoToEntity(alertRequest);
        alertsRepository.save(alertEntity);
        return convertAlertsResponseDto(alertEntity);
    }
    @Override
    public void triggerDemandAlertsIfNeeded(
        String userID,
        boolean isMaterialDemandChange,
        double oldValue,
        double newValue
    ) {
        List<AlertEntity> alerts = alertsRepository.findAll(); // TODO : only bring my alerts
        alerts.forEach(
            alertEntity -> {
                TriggeredAlertEntity triggeredAlertEntity = new TriggeredAlertEntity();
                triggeredAlertEntity.setId(UUID.randomUUID());
                triggeredAlertEntity.setAlertName(alertEntity.getAlertName());
                triggeredAlertEntity.setDescription(alertEntity.getDescription());
                triggeredAlertEntity.setType(alertEntity.getType());
                triggeredAlertEntity.setUserID(alertEntity.getUserID());
                triggeredAlertEntity.setMonitoredObjects(alertEntity.getMonitoredObjects());
                triggeredAlertEntity.setThreshold(alertEntity.getThreshold());
                LocalDateTime currentLocalDateTime = LocalDateTime.now();
                triggeredAlertEntity.setCreated(Timestamp.valueOf(currentLocalDateTime).toString());
                //triggeredAlertEntity.setTriggerTimesInThreeMonths(alertEntity.getTriggerTimesInThreeMonths());
                //triggeredAlertEntity.setTriggerTimes(alertEntity.getTriggerTimes());

                if (
                    alertEntity.getMonitoredObjects().equals(AlertsMonitoredObjects.ALL_DEMANDS) ||
                    (
                        alertEntity.getMonitoredObjects().equals(AlertsMonitoredObjects.ALL_CAPACITIES) &&
                        !isMaterialDemandChange
                    ) ||
                    alertEntity.getMonitoredObjects().equals(AlertsMonitoredObjects.ALL_OBJECTS)
                ) {
                    if (alertEntity.getType().equals(AlertThresholdType.RELATIVE)) {
                        double threshold = alertEntity.getThreshold();
                        double demandDelta = threshold * oldValue;
                        if (
                            threshold >= 0 &&
                            (newValue - oldValue >= demandDelta) ||
                            (threshold < 0 && (newValue - oldValue <= demandDelta))
                        ) {
                            // TODO : adjust the demand description , trigger times here
                            triggeredAlertsRepository.save(triggeredAlertEntity);
                        }
                    }
                } else if (alertEntity.getMonitoredObjects().equals(AlertsMonitoredObjects.DEDICATED)) {
                    if (alertEntity.getType().equals(AlertThresholdType.ABSOLUTE)) {
                        double threshold = alertEntity.getThreshold();
                        if (
                            threshold >= 0 &&
                            (newValue - oldValue >= threshold) ||
                            (threshold < 0 && (newValue - oldValue <= threshold))
                        ) {
                            // TODO : adjust the demand description , trigger times here
                            triggeredAlertsRepository.save(triggeredAlertEntity);
                        }
                    } else {
                        double threshold = alertEntity.getThreshold();
                        double demandDelta = alertEntity.getThreshold() * oldValue;
                        if (
                            threshold >= 0 &&
                            (newValue - oldValue >= demandDelta) ||
                            (threshold < 0 && (newValue - oldValue <= demandDelta))
                        ) {
                            // TODO : adjust the demand description , trigger times here
                            triggeredAlertsRepository.save(triggeredAlertEntity);
                        }
                    }
                }
            }
        );
    }

    @Override
    public List<AlertResponse> getAlerts(String userID) {
        List<AlertEntity> alerts = alertsRepository.findAll();

        getAlertByUserId(userID, alerts);
        return alerts.stream().map(this::convertAlertsResponseDto).toList();
    }

    private static void getTriggeredAlertByUserId(String userID, List<TriggeredAlertEntity> alerts) {
        alerts
            .stream()
            .filter(
                alertEntity -> {
                    if (alertEntity.getUserID().toString().equals(userID)) {
                        alerts.add(alertEntity);
                    }
                    return false;
                }
            );
    }

    private static void getAlertByUserId(String userID, List<AlertEntity> alerts) {
        alerts
            .stream()
            .filter(
                alertEntity -> {
                    if (alertEntity.getUserID().toString().equals(userID)) {
                        alerts.add(alertEntity);
                    }
                    return false;
                }
            );
    }

    @Override
    public List<TriggeredAlertResponse> getTriggeredAlerts(String userID) {
        List<TriggeredAlertEntity> alerts = triggeredAlertsRepository.findAll();

        getTriggeredAlertByUserId(userID, alerts);
        return alerts.stream().map(this::convertTriggeredAlertsResponseDto).toList();
    }

    @Override
    public TriggeredAlertResponse postTriggeredAlerts(TriggeredAlertRequest triggeredAlertRequest) {
        return null;
    }

    private AlertResponse convertAlertsResponseDto(AlertEntity alertEntity) {
        AlertResponse responseDto = new AlertResponse();
        responseDto.setType(alertEntity.getType().name());
        responseDto.setAlertId("" + alertEntity.getId());
        responseDto.setAlertName(alertEntity.getAlertName());
        responseDto.setCreated(alertEntity.getCreated());
        responseDto.setDescription(alertEntity.getDescription());
        responseDto.setMonitoredObjects(alertEntity.getMonitoredObjects().name());
        responseDto.setThreshold(String.valueOf(alertEntity.getThreshold()));
        responseDto.setUser(alertEntity.getUserID().toString());
        return responseDto;
    }

    private TriggeredAlertResponse convertTriggeredAlertsResponseDto(TriggeredAlertEntity alertEntity) {
        TriggeredAlertResponse responseDto = new TriggeredAlertResponse();
        responseDto.setType(alertEntity.getType().name());
        responseDto.setAlertId("" + alertEntity.getId());
        responseDto.setAlertName(alertEntity.getAlertName());
        responseDto.setCreated(alertEntity.getCreated());
        responseDto.setDescription(alertEntity.getDescription());
        responseDto.setMonitoredObjects(alertEntity.getMonitoredObjects().name());
        responseDto.setThreshold(String.valueOf(alertEntity.getThreshold()));
        //        responseDto.setTriggerTimes(alertEntity.getTriggerTimes());
        //        responseDto.setTriggerTimesInThreeMonths(alertEntity.getTriggerTimesInThreeMonths());
        responseDto.setUser(alertEntity.getUserID().toString());
        return responseDto;
    }

    private AlertEntity convertDtoToEntity(AlertRequest alertRequest) {
        return AlertEntity
            .builder()
            .id(UUID.randomUUID())
            .alertName(alertRequest.getAlertName())
            .created(alertRequest.getCreated())
            .description(alertRequest.getDescription())
            .monitoredObjects(AlertsMonitoredObjects.valueOf(alertRequest.getMonitoredObjects()))
            .threshold(Double.parseDouble(alertRequest.getThreshold().toString()))
            .userID(UUID.fromString(alertRequest.getUser()))
            .type(AlertThresholdType.valueOf(alertRequest.getType()))
            .build();
    }
}
