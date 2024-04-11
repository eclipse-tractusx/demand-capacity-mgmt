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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.AlertThresholdType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.AlertsMonitoredObjects;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
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
        double newValue,
        String materialDemandId
    ) {
        List<AlertEntity> alerts = alertsRepository.findAllByUserID(UUID.fromString(userID));
        alerts.forEach(
            alertEntity -> {
                TriggeredAlertEntity triggeredAlertEntity = new TriggeredAlertEntity();
                triggeredAlertEntity.setId(UUID.randomUUID());
                triggeredAlertEntity.setAlertName(alertEntity.getAlertName());
                triggeredAlertEntity.setType(alertEntity.getType());
                triggeredAlertEntity.setUserID(alertEntity.getUserID());
                triggeredAlertEntity.setMonitoredObjects(alertEntity.getMonitoredObjects());
                triggeredAlertEntity.setThreshold(alertEntity.getThreshold());
                LocalDateTime currentLocalDateTime = LocalDateTime.now();
                triggeredAlertEntity.setCreated(Timestamp.valueOf(currentLocalDateTime).toString());
                if (isGlobalAlert(isMaterialDemandChange, alertEntity)) {
                    if (alertEntity.getType().equals(AlertThresholdType.RELATIVE)) {
                        double threshold = alertEntity.getThreshold() / 100;
                        double demandDelta = threshold * oldValue;
                        if (threshold >= 0 && (newValue - oldValue >= demandDelta)) {
                            fillTriggeredAlert(
                                triggeredAlertEntity,
                                "Increased by ",
                                alertEntity.getThreshold(),
                                true,
                                alertEntity
                            );
                        } else if ((threshold < 0 && (newValue - oldValue <= demandDelta))) {
                            fillTriggeredAlert(
                                triggeredAlertEntity,
                                "Decreased by ",
                                alertEntity.getThreshold(),
                                true,
                                alertEntity
                            );
                        }
                    } else if (alertEntity.getType().equals(AlertThresholdType.ABSOLUTE)) {
                        double threshold = alertEntity.getThreshold();
                        if (threshold >= 0 && (newValue - oldValue >= threshold)) {
                            fillTriggeredAlert(triggeredAlertEntity, "Increased by ", threshold, false, alertEntity);
                        } else if ((threshold < 0 && (newValue - oldValue <= threshold))) {
                            fillTriggeredAlert(triggeredAlertEntity, "Decreased by ", threshold, false, alertEntity);
                        }
                    }
                } else if (alertEntity.getMonitoredObjects().equals(AlertsMonitoredObjects.DEDICATED)) {
                    alertEntity
                        .getDedicatedAlerts()
                        .forEach(
                            dedicatedAlert -> {
                                if (Objects.equals(materialDemandId, dedicatedAlert.getObjectId().toString())) {
                                    if (alertEntity.getType().equals(AlertThresholdType.ABSOLUTE)) {
                                        double threshold = alertEntity.getThreshold();
                                        if (threshold >= 0 && (newValue - oldValue >= threshold)) {
                                            fillTriggeredAlert(
                                                triggeredAlertEntity,
                                                "Increased by ",
                                                threshold,
                                                false,
                                                alertEntity
                                            );
                                        } else if ((threshold < 0 && (newValue - oldValue <= threshold))) {
                                            fillTriggeredAlert(
                                                triggeredAlertEntity,
                                                "Decreased by ",
                                                threshold,
                                                false,
                                                alertEntity
                                            );
                                        }
                                    } else {
                                        double threshold = alertEntity.getThreshold() / 100;
                                        double demandDelta = alertEntity.getThreshold() * oldValue;
                                        if (threshold >= 0 && (newValue - oldValue >= demandDelta)) {
                                            fillTriggeredAlert(
                                                triggeredAlertEntity,
                                                "Increased by ",
                                                threshold,
                                                true,
                                                alertEntity
                                            );
                                        } else if ((threshold < 0 && (newValue - oldValue <= demandDelta))) {
                                            fillTriggeredAlert(
                                                triggeredAlertEntity,
                                                "Decreased by ",
                                                threshold,
                                                true,
                                                alertEntity
                                            );
                                        }
                                    }
                                }
                            }
                        );
                }
            }
        );
    }

    private void fillTriggeredAlert(
        TriggeredAlertEntity triggeredAlertEntity,
        String message,
        double threshold,
        boolean isRelative,
        AlertEntity alertEntity
    ) {
        triggeredAlertEntity.setDescription(message + threshold + (isRelative ? "%" : " units"));
        alertEntity.setTriggeredTimes(alertEntity.getTriggeredTimes() + 1);
        alertsRepository.save(alertEntity);
        triggeredAlertsRepository.save(triggeredAlertEntity);
    }

    private static boolean isGlobalAlert(boolean isMaterialDemandChange, AlertEntity alertEntity) {
        return (
            alertEntity.getMonitoredObjects().equals(AlertsMonitoredObjects.ALL_DEMANDS) ||
            (
                alertEntity.getMonitoredObjects().equals(AlertsMonitoredObjects.ALL_CAPACITIES) &&
                !isMaterialDemandChange
            ) ||
            alertEntity.getMonitoredObjects().equals(AlertsMonitoredObjects.ALL_OBJECTS)
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
        List<DedicatedAlert> dedicatedAlerts = alertEntity
            .getDedicatedAlerts()
            .stream()
            .map(this::enrichDedicateAlertResponse)
            .toList();

        AlertResponse responseDto = new AlertResponse();
        responseDto.setType(alertEntity.getType().name());
        responseDto.setAlertId("" + alertEntity.getId());
        responseDto.setAlertName(alertEntity.getAlertName());
        responseDto.setCreated(alertEntity.getCreated());
        responseDto.setMonitoredObjects(alertEntity.getMonitoredObjects().name());
        responseDto.setThreshold(String.valueOf(alertEntity.getThreshold()));
        responseDto.setUser(alertEntity.getUserID().toString());
        //responseDto.setTriggerTimes(alertEntity.getTriggeredTimes());
        responseDto.setDedicatedAlerts(dedicatedAlerts);
        return responseDto;
    }

    DedicatedAlert enrichDedicateAlertResponse(DedicatedAlertEntity alertEntity) {
        DedicatedAlert dedicatedAlert = new DedicatedAlert();
        dedicatedAlert.setId(alertEntity.getId().toString());
        dedicatedAlert.setType(alertEntity.getType().toString());
        dedicatedAlert.setObjectId(alertEntity.getObjectId().toString());
        return dedicatedAlert;
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
        responseDto.setUser(alertEntity.getUserID().toString());
        return responseDto;
    }

    DedicatedAlertEntity convertDedicatedAlertsDtoToEntity(DedicatedAlert dedicatedAlert) {
        return DedicatedAlertEntity
            .builder()
            .id(UUID.randomUUID())
            .type(EventObjectType.valueOf(dedicatedAlert.getType()))
            .objectId(UUID.fromString(dedicatedAlert.getObjectId()))
            .build();
    }

    private AlertEntity convertDtoToEntity(AlertRequest alertRequest) {
        List<DedicatedAlertEntity> dedicatedAlertEntities = alertRequest
            .getDedicatedAlerts()
            .stream()
            .map(this::convertDedicatedAlertsDtoToEntity)
            .toList();
        LocalDateTime currentLocalDateTime = LocalDateTime.now();

        return AlertEntity
            .builder()
            .id(UUID.randomUUID())
            .alertName(alertRequest.getAlertName())
            .created(Timestamp.valueOf(currentLocalDateTime).toString())
            .monitoredObjects(AlertsMonitoredObjects.valueOf(alertRequest.getMonitoredObjects()))
            .threshold(Double.parseDouble(alertRequest.getThreshold().toString()))
            .triggeredTimes(0)
            .userID(UUID.fromString(alertRequest.getUser()))
            .type(AlertThresholdType.valueOf(alertRequest.getType()))
            .dedicatedAlerts(dedicatedAlertEntities)
            .build();
    }
}
