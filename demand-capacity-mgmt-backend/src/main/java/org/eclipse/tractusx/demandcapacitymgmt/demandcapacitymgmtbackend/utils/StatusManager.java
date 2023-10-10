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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.CapacityDeviation;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.StatusColor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.models.MaterialCapacityQuantity;

public class StatusManager {

    int materialDemandOrder = 0;

    public static StatusColor getStatusColor(double demand, double maxCapacity, double actualCapacity) {
        CapacityDeviation capacityDeviation = CapacityDeviation.ZERO;
        if (demand > maxCapacity) {
            capacityDeviation = CapacityDeviation.BOTTLENECK;
        } else if (demand > actualCapacity && demand < maxCapacity) {
            capacityDeviation = CapacityDeviation.BOTTLENECK;
        } else if (demand < actualCapacity) {
            capacityDeviation = CapacityDeviation.SURPLUS;
        }
        return capacityDeviation.getStatusColor();
    }

    public static EventType getEventType(
        boolean isMaterialDemandLinkedToCG,
        boolean isCustomer,
        StatusColor oldStatusColor,
        StatusColor newStatusColor
    ) {
        if (!isMaterialDemandLinkedToCG) {
            if (!isCustomer) {
                return EventType.TODO;
            }
            return EventType.UN_LINKED;
        }
        if (newStatusColor == oldStatusColor) {
            return EventType.GENERAL_EVENT;
        }
        if (
            newStatusColor == StatusColor.GREEN ||
            (oldStatusColor == StatusColor.RED && newStatusColor == StatusColor.YELLOW)
        ) {
            return EventType.STATUS_IMPROVEMENT;
        }
        if (
            newStatusColor == StatusColor.RED ||
            (oldStatusColor == StatusColor.GREEN && newStatusColor == StatusColor.YELLOW)
        ) {
            return EventType.STATUS_REDUCTION;
        }

        return EventType.GENERAL_EVENT;
    }

    public StatusRequest retrieveUpdatedStatusRequest(
        List<WeekBasedCapacityGroupDtoResponse> oldWeekBasedCapacityGroupResponse,
        List<WeekBasedCapacityGroupDtoResponse> newWeekBasedCapacityGroupResponse,
        List<WeekBasedMaterialDemandResponseDto> oldWeekBasedMaterialDemandResponse,
        List<WeekBasedMaterialDemandResponseDto> newWeekBasedMaterialDemandResponse
    ) {
        Map<CompositeKey, List<CapacitiesDto>> oldMaterialNumberCapacitiesMapList = createMaterialNumberCapacitiesMapList(
            oldWeekBasedCapacityGroupResponse
        );
        Map<CompositeKey, List<CapacitiesDto>> newMaterialNumberCapacitiesMapList = createMaterialNumberCapacitiesMapList(
            newWeekBasedCapacityGroupResponse
        );

        Map<CompositeKey, List<DemandSeriesDto>> oldMaterialNumberDemandsMapList = createMaterialNumberDemandsMapList(
            oldWeekBasedMaterialDemandResponse
        );
        Map<CompositeKey, List<DemandSeriesDto>> newMaterialNumberDemandsMapList = createMaterialNumberDemandsMapList(
            newWeekBasedMaterialDemandResponse
        );

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

        processMaterialDemands(
            todoCount,
            overAllTodoCount,
            true,
            newCapacityQuantities,
            newMaterialNumberDemandsMapList,
            newMaterialNumberCapacitiesMapList
        );

        processMaterialDemands(
            todoCount,
            overAllTodoCount,
            false,
            oldCapacityQuantities,
            oldMaterialNumberDemandsMapList,
            oldMaterialNumberCapacitiesMapList
        );

        processCapacityQuantities(
            oldCapacityQuantities,
            newCapacityQuantities,
            statusReductionCount,
            statusImprovementCount,
            overAllStatusReductionCount,
            overAllStatusImprovementCount
        );

        setAllDemandsCountCount(allDemandsCount, newMaterialNumberDemandsMapList);

        // set the general count
        generalCount.set(
            allDemandsCount.get() - (todoCount.get() + statusImprovementCount.get() + statusReductionCount.get())
        );

        overAllGeneralCount.set(
            newMaterialNumberDemandsMapList.size() -
            (overAllTodoCount.get() + overAllStatusImprovementCount.get() + overAllStatusReductionCount.get())
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

        // Post the StatusRequest
        return statusRequest;
    }

    private Map<CompositeKey, List<DemandSeriesDto>> createMaterialNumberDemandsMapList(
        List<WeekBasedMaterialDemandResponseDto> weekBasedMaterialDemandEntities
    ) {
        Map<CompositeKey, List<DemandSeriesDto>> materialNumberDemandsMapList = new HashMap<>();

        weekBasedMaterialDemandEntities.forEach(
            weekBasedMaterialDemand -> {
                String materialNumberCustomer = weekBasedMaterialDemand
                    .getWeekBasedMaterialDemandRequest()
                    .getMaterialNumberCustomer();

                weekBasedMaterialDemand
                    .getWeekBasedMaterialDemandRequest()
                    .getDemandSeries()
                    .forEach(
                        demandWeekSeriesDto -> {
                            CompositeKey compositeKey = new CompositeKey();
                            compositeKey.setCustomerLocation(demandWeekSeriesDto.getCustomerLocation());
                            compositeKey.setMaterialNumberCustomer(materialNumberCustomer);
                            compositeKey.setDemandCategory(demandWeekSeriesDto.getDemandCategory().getId());
                            materialNumberDemandsMapList.put(compositeKey, demandWeekSeriesDto.getDemands());
                        }
                    );
            }
        );
        return materialNumberDemandsMapList;
    }

    private Map<CompositeKey, List<CapacitiesDto>> createMaterialNumberCapacitiesMapList(
        List<WeekBasedCapacityGroupDtoResponse> weekBasedCapacityGroupEntities
    ) {
        Map<CompositeKey, List<CapacitiesDto>> materialNumberCapacitiesMap = new HashMap<>();

        weekBasedCapacityGroupEntities.forEach(
            weekBasedCapacityGroup -> {
                List<CapacitiesDto> capacitiesDtos = weekBasedCapacityGroup
                    .getWeekBasedCapacityGroupRequest()
                    .getCapacities();

                weekBasedCapacityGroup
                    .getWeekBasedCapacityGroupRequest()
                    .getLinkedDemandSeries()
                    .forEach(
                        linkedDemandSeriesRequest -> {
                            CompositeKey compositeKey = new CompositeKey();

                            compositeKey.setCustomerLocation(linkedDemandSeriesRequest.getCustomerLocation());
                            compositeKey.setMaterialNumberCustomer(
                                linkedDemandSeriesRequest.getMaterialNumberCustomer()
                            );
                            compositeKey.setDemandCategory(
                                linkedDemandSeriesRequest.getDemandCategory().getDemandCategory()
                            );
                            materialNumberCapacitiesMap.put(compositeKey, capacitiesDtos);
                        }
                    );
            }
        );
        return materialNumberCapacitiesMap;
    }

    private void setAllDemandsCountCount(
        AtomicInteger allDemandsCount,
        Map<CompositeKey, List<DemandSeriesDto>> materialNumberDemandsMap
    ) {
        for (Map.Entry<CompositeKey, List<DemandSeriesDto>> materialNumberDemandsMapEntry : materialNumberDemandsMap.entrySet()) {
            allDemandsCount.set(allDemandsCount.get() + materialNumberDemandsMapEntry.getValue().size());
        }
    }

    private void processMaterialDemands(
        AtomicInteger todoCount,
        AtomicInteger overAllTodoCount,
        boolean isNewMaterialDemands,
        List<MaterialCapacityQuantity> capacityQuantities,
        Map<CompositeKey, List<DemandSeriesDto>> materialNumberDemandsMap,
        Map<CompositeKey, List<CapacitiesDto>> materialNumberCapacitiesMap
    ) {
        AtomicBoolean isOverAllTodo = new AtomicBoolean(false);
        for (Map.Entry<CompositeKey, List<DemandSeriesDto>> materialNumberDemandsMapEntry : materialNumberDemandsMap.entrySet()) {
            //            if (!materialNumberCapacitiesMap.containsKey(materialNumberDemandsMapEntry.getKey().materialNumberCustomer) && isNewMaterialDemands) {
            //                overAllTodoCount.incrementAndGet();
            //            }
            AtomicBoolean isTodo = new AtomicBoolean(false);
            materialDemandOrder++;
            materialNumberDemandsMapEntry
                .getValue()
                .forEach(
                    demandSeriesDto -> {
                        for (Map.Entry<CompositeKey, List<CapacitiesDto>> materialNumberCapacitiesMapEntry : materialNumberCapacitiesMap.entrySet()) {
                            if (
                                !(
                                    materialNumberCapacitiesMapEntry
                                        .getKey()
                                        .materialNumberCustomer.equals(
                                            materialNumberDemandsMapEntry.getKey().materialNumberCustomer
                                        )
                                ) &&
                                isNewMaterialDemands
                            ) {
                                //todoCount.incrementAndGet();
                                isTodo.set(true);
                            }
                            if (
                                isCompositeKeysMatches(materialNumberDemandsMapEntry, materialNumberCapacitiesMapEntry)
                            ) {
                                materialNumberCapacitiesMapEntry
                                    .getValue()
                                    .forEach(
                                        capacitiesDto -> {
                                            if (
                                                capacitiesDto
                                                    .getCalendarWeek()
                                                    .equals(demandSeriesDto.getCalendarWeek())
                                            ) {
                                                capacityQuantities.add(
                                                    new MaterialCapacityQuantity(
                                                        Double.parseDouble(capacitiesDto.getMaximumCapacity()),
                                                        Double.parseDouble(capacitiesDto.getActualCapacity()),
                                                        DataConverterUtil.convertFromString(
                                                            capacitiesDto.getCalendarWeek()
                                                        ),
                                                        Double.parseDouble(demandSeriesDto.getDemand()),
                                                        materialDemandOrder
                                                    )
                                                );
                                            }
                                        }
                                    );
                            }
                        }
                        if (isTodo.get() && isNewMaterialDemands) {
                            todoCount.incrementAndGet();
                            isOverAllTodo.set(true);
                            isTodo.set(false);
                        }
                    }
                );
            if (isOverAllTodo.get() && isNewMaterialDemands) {
                overAllTodoCount.incrementAndGet();
                isOverAllTodo.set(false);
            }
        }
    }

    private static boolean isCompositeKeysMatches(
        Map.Entry<CompositeKey, List<DemandSeriesDto>> materialNumberDemandsMapEntry,
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
        AtomicInteger overAllStatusImprovementCount
    ) {
        AtomicInteger previousDemand = new AtomicInteger(-1);
        oldMaterialCapacityQuantities.forEach(
            oldCapacityQuantity ->
                newMaterialCapacityQuantities.forEach(
                    newCapacityQuantity -> {
                        if (
                            oldCapacityQuantity.getCalendarWeek().getDayOfYear() ==
                            newCapacityQuantity.getCalendarWeek().getDayOfYear() &&
                            oldCapacityQuantity.getCalendarWeek().getYear() ==
                            newCapacityQuantity.getCalendarWeek().getYear()
                        ) {
                            EventType eventType = getEventType(oldCapacityQuantity, newCapacityQuantity);

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
                    }
                )
        );
    }

    private static EventType getEventType(
        MaterialCapacityQuantity oldCapacityQuantity,
        MaterialCapacityQuantity newCapacityQuantity
    ) {
        StatusColor oldStatusColor = StatusManager.getStatusColor(
            oldCapacityQuantity.getDemand(),
            oldCapacityQuantity.getMaximumCapacity(),
            oldCapacityQuantity.getActualCapacity()
        );
        StatusColor newStatusColor = StatusManager.getStatusColor(
            newCapacityQuantity.getDemand(),
            newCapacityQuantity.getMaximumCapacity(),
            newCapacityQuantity.getActualCapacity()
        );

        return StatusManager.getEventType(true, false, oldStatusColor, newStatusColor);
    }
}

class CompositeKey {

    String customerLocation;
    String demandCategory;

    public void setCustomerLocation(String customerLocation) {
        this.customerLocation = customerLocation;
    }

    public void setDemandCategory(String demandCategory) {
        this.demandCategory = demandCategory;
    }

    public void setMaterialNumberCustomer(String materialNumberCustomer) {
        this.materialNumberCustomer = materialNumberCustomer;
    }

    public String getCustomerLocation() {
        return customerLocation;
    }

    public String getDemandCategory() {
        return demandCategory;
    }

    public String getMaterialNumberCustomer() {
        return materialNumberCustomer;
    }

    String materialNumberCustomer;
}
