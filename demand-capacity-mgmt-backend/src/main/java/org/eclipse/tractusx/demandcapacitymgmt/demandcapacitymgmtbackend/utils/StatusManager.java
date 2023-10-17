/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *    See the NOTICE file(s) distributed with this work for additional
 *    information regarding copyright ownership.
 *
 *    This program and the accompanying materials are made available under the
 *    terms of the Apache License, Version 2.0 which is available at
 *    https://www.apache.org/licenses/LICENSE-2.0.
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *    License for the specific language governing permissions and limitations
 *    under the License.
 *
 *    SPDX-License-Identifier: Apache-2.0
 *    ********************************************************************************
 */

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.StatusColor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.models.MaterialCapacityQuantity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkedCapacityGroupMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StatusManager {

    int materialDemandOrder = 0;
    public EventType eventType;

    private final LinkedCapacityGroupMaterialDemandRepository linkedCapacityGroupMaterialDemandRepository;

    private UserRepository userRepository;

    public StatusManager(LinkedCapacityGroupMaterialDemandRepository linkedCapacityGroupMaterialDemandRepository,UserRepository userRepository) {
        this.linkedCapacityGroupMaterialDemandRepository = linkedCapacityGroupMaterialDemandRepository;
        this.userRepository = userRepository;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    private void populateEventType(
        StatusesResponse currentStatuses,
        int overAllTodoCount,
        int overAllStatusImprovementCount,
        int overAllStatusReductionCount,
        String userID) {
        Optional<UserEntity> userEntity = userRepository.findById(UUID.fromString(userID));
        UserEntity user = null;
        if(userEntity.isPresent()){
            user = userEntity.get();
        }
        if (currentStatuses == null) {
            if (overAllTodoCount != 0) {
                if (user.getRole().equals(Role.CUSTOMER)) {
                    setEventType(EventType.TODO);
                }
                setEventType(EventType.UN_LINKED);
            } else if (overAllStatusImprovementCount != 0) {
                setEventType(EventType.STATUS_IMPROVEMENT);
            } else if (overAllStatusReductionCount != 0) {
                setEventType(EventType.STATUS_REDUCTION);
            } else {
                setEventType(EventType.GENERAL_EVENT);
            }
        } else {
            // if to-do increased, then the latest status is todo
            if (currentStatuses.getOverallTodos() != overAllTodoCount && overAllTodoCount != 0) {
                if (user.getRole().equals(Role.CUSTOMER)) {
                    setEventType(EventType.TODO);
                }
                setEventType(EventType.UN_LINKED);
            } else if (
                currentStatuses.getOverallStatusImprovement() != overAllStatusImprovementCount &&
                overAllStatusImprovementCount != 0
            ) {
                setEventType(EventType.STATUS_IMPROVEMENT);
            } else if (
                currentStatuses.getOverallStatusDegredation() != overAllStatusReductionCount &&
                overAllStatusReductionCount != 0
            ) {
                setEventType(EventType.STATUS_REDUCTION);
            } else {
                setEventType(EventType.GENERAL_EVENT);
            }
        }
    }

    public EventType getEventType() {
        return this.eventType;
    }

    public StatusRequest retrieveUpdatedStatusRequest(
        StatusesResponse currentStatuses,
        List<CapacityGroupEntity> oldCapacityGroup,
        List<CapacityGroupEntity> newCapacityGroup,
        List<MaterialDemandEntity> oldMaterialDemand,
        List<MaterialDemandEntity> newMaterialDemand,
        String userID) {
        Optional<UserEntity> userEntity = userRepository.findById(UUID.fromString(userID));
        UserEntity user = null;
        if(userEntity.isPresent()){
            user = userEntity.get();
        }
        List<MaterialCapacityQuantity> oldCapacityQuantities = new ArrayList<>();
        List<MaterialCapacityQuantity> newCapacityQuantities = new ArrayList<>();

        AtomicInteger todoCount = new AtomicInteger();
        AtomicInteger generalCount = new AtomicInteger();
        AtomicInteger statusImprovementCount = new AtomicInteger();
        AtomicInteger statusReductionCount = new AtomicInteger();
        AtomicInteger allDemandsCount = new AtomicInteger();
        AtomicInteger overAllGeneralCount = new AtomicInteger();
        AtomicInteger overAllStatusImprovementCount = new AtomicInteger();
        AtomicInteger overAllStatusReductionCount = new AtomicInteger();
        AtomicInteger overAllTodoCount = new AtomicInteger();

        try {
            processMaterialDemands(todoCount, overAllTodoCount, newCapacityGroup, newMaterialDemand, newCapacityQuantities);
            processMaterialDemands(todoCount, overAllTodoCount, oldCapacityGroup, oldMaterialDemand, oldCapacityQuantities);
        } catch (Exception e) {
            //TODO SAJA FIX
            System.out.println("Needs fix.");
        }


        processCapacityQuantities(
            oldCapacityQuantities,
            newCapacityQuantities,
            statusReductionCount,
            statusImprovementCount,
            overAllStatusReductionCount,
            overAllStatusImprovementCount,
            user
        );

        StatusRequest statusRequest = new StatusRequest();
        // Set DTOs in StatusRequest
        statusRequest.setTodos(todoCount.get());
        statusRequest.setGeneral(generalCount.get());
        statusRequest.setStatusImprovement(statusImprovementCount.get());
        statusRequest.setStatusDegradation(statusReductionCount.get());
        statusRequest.setOverallTodos(overAllTodoCount.get());
        statusRequest.setOverallGeneral(overAllGeneralCount.get());
        statusRequest.setOverallStatusImprovement(overAllStatusImprovementCount.get());
        statusRequest.setOverallStatusDegradation(overAllStatusReductionCount.get());

        populateEventType(
            currentStatuses,
            overAllTodoCount.intValue(),
            overAllStatusImprovementCount.intValue(),
            overAllStatusReductionCount.intValue(),
                userID
        );

        return statusRequest;
    }

    private Map<MaterialDemandEntity, CapacityGroupEntity> processMaterialDemands(
        AtomicInteger todoCount,
        AtomicInteger overAllTodoCount,
        List<CapacityGroupEntity> CapacityGroupEntities,
        List<MaterialDemandEntity> materialDemandEntities,
        List<MaterialCapacityQuantity> materialCapacityQuantities
    ) {
        Map<MaterialDemandEntity, CapacityGroupEntity> capacitiesLinkedDemandsMap = new HashMap<>();
        AtomicBoolean isLinked = new AtomicBoolean(false);
        List<LinkedCapacityGroupMaterialDemandEntity> linkedCGMD = linkedCapacityGroupMaterialDemandRepository.findAll();

        materialDemandEntities.forEach(
            materialDemandEntity -> {
                isLinked.set(
                    !(
                        linkedCGMD
                            .stream()
                            .filter(li -> li.getMaterialDemandID().equals(materialDemandEntity.getId()))
                            .toList()
                            .isEmpty()
                    )
                );

                if (!isLinked.get()) {
                    overAllTodoCount.incrementAndGet();
                    materialDemandEntity
                        .getDemandSeries()
                        .forEach(
                            demandSeries -> {
                                todoCount.set(todoCount.get() + demandSeries.getDemandSeriesValues().size());
                            }
                        );
                }
            }
        );

        CapacityGroupEntities.forEach(
            capacityGroup -> {
                linkedCGMD.forEach(
                    linkedCapacityGroupMaterialDemandEntity -> {
                        MaterialDemandEntity materialDemand = getMaterialDemandById(
                            materialDemandEntities,
                            linkedCapacityGroupMaterialDemandEntity.getMaterialDemandID().toString()
                        );
                        if (materialDemand != null) {
                            materialDemand
                                .getDemandSeries()
                                .forEach(
                                    materialDemandSeriesResponse -> {
                                        materialDemandSeriesResponse
                                            .getDemandSeriesValues()
                                            .forEach(
                                                materialDemandSeriesValue -> {
                                                    materialCapacityQuantities.add(
                                                        new MaterialCapacityQuantity(
                                                            Double.parseDouble(
                                                                capacityGroup.getDefaultMaximumCapacity() + ""
                                                            ),
                                                            Double.parseDouble(
                                                                capacityGroup.getDefaultActualCapacity() + ""
                                                            ),
                                                            null,
                                                                materialDemandSeriesValue.getDemand(),
                                                            materialDemandOrder
                                                        )
                                                    );
                                                }
                                            );
                                    }
                                );
                        }
                    }
                );
            }
        );
        return capacitiesLinkedDemandsMap;
    }

    MaterialDemandEntity getMaterialDemandById(List<MaterialDemandEntity> materialDemandEntities, String id) {
        List<MaterialDemandEntity> materialDemands = materialDemandEntities
            .stream()
            .filter(materialDemandEntity -> materialDemandEntity.getId().toString().equals(id))
            .toList();
        if (!materialDemands.isEmpty()) return materialDemands.get(0);
        return null;
    }

    private void setAllDemandsCountCount(
        AtomicInteger allDemandsCount,
        Map<CompositeKey, List<DemandSeriesValues>> materialNumberDemandsMap
    ) {
        for (Map.Entry<CompositeKey, List<DemandSeriesValues>> materialNumberDemandsMapEntry : materialNumberDemandsMap.entrySet()) {
            allDemandsCount.set(allDemandsCount.get() + materialNumberDemandsMapEntry.getValue().size());
        }
    }

    private static boolean isCompositeKeysMatches(
        Map.Entry<CompositeKey, List<DemandSeriesValues>> materialNumberDemandsMapEntry,
        Map.Entry<CompositeKey, List<CapacitiesDto>> materialNumberCapacitiesMapEntry
    ) {
        return (
            materialNumberDemandsMapEntry
                .getKey()
                .customerLocation.equals(materialNumberCapacitiesMapEntry.getKey().customerLocation) &&
            materialNumberDemandsMapEntry
                .getKey()
                .demandCategory.equals(materialNumberCapacitiesMapEntry.getKey().demandCategory) &&
            materialNumberDemandsMapEntry
                .getKey()
                .materialNumberCustomer.equals(materialNumberCapacitiesMapEntry.getKey().materialNumberCustomer)
        );
    }

    // Helper method to process old and new capacity quantities and update status lists
    private void processCapacityQuantities(
        List<MaterialCapacityQuantity> oldMaterialCapacityQuantities,
        List<MaterialCapacityQuantity> newMaterialCapacityQuantities,
        AtomicInteger statusReductionCount,
        AtomicInteger statusImprovementCount,
        AtomicInteger overAllStatusReductionCount,
        AtomicInteger overAllStatusImprovementCount,
        UserEntity user
    ) {
        AtomicInteger previousDemand = new AtomicInteger(-1);
        oldMaterialCapacityQuantities.forEach(
            oldCapacityQuantity ->
                newMaterialCapacityQuantities.forEach(
                    newCapacityQuantity -> {
                        EventType eventType = getEventType(oldCapacityQuantity, newCapacityQuantity,user);

                        if (eventType == EventType.STATUS_REDUCTION) {
                            if (
                                previousDemand.get() == -1 ||
                                previousDemand.get() != newCapacityQuantity.getMaterialDemandOrder()
                            ) {
                                overAllStatusReductionCount.set(overAllStatusReductionCount.get() + 1);
                            }
                            statusReductionCount.set(statusReductionCount.get() + 1);
                        } else if (eventType == EventType.STATUS_IMPROVEMENT) {
                            if (
                                previousDemand.get() != -1 ||
                                previousDemand.get() != newCapacityQuantity.getMaterialDemandOrder()
                            ) {
                                overAllStatusImprovementCount.set(overAllStatusImprovementCount.get() + 1);
                            }
                            statusImprovementCount.set(statusImprovementCount.get() + 1);
                        }
                        previousDemand.set(newCapacityQuantity.getMaterialDemandOrder());
                    }
                )
        );
    }

    private static EventType getEventType(
        MaterialCapacityQuantity oldCapacityQuantity,
        MaterialCapacityQuantity newCapacityQuantity,
        UserEntity user
    ) {
        StatusColor oldStatusColor = WeekBasedStatusManager.getStatusColor(
            oldCapacityQuantity.getDemand(),
            oldCapacityQuantity.getMaximumCapacity(),
            oldCapacityQuantity.getActualCapacity()
        );
        StatusColor newStatusColor = WeekBasedStatusManager.getStatusColor(
            newCapacityQuantity.getDemand(),
            newCapacityQuantity.getMaximumCapacity(),
            newCapacityQuantity.getActualCapacity()
        );

        return WeekBasedStatusManager.getEventType(
            true, user.getRole().equals(Role.CUSTOMER),
            oldStatusColor,
            newStatusColor
        );
    }
}
