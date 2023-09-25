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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.StatusObjectEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.StatusesEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.StatusColor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.StatusesRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusesService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.DataConverterUtil;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.StatusManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Lazy
public class StatusesServiceImpl implements StatusesService {

    @Autowired
    private final StatusesRepository statusesRepository;

    List<WeekBasedCapacityGroupDtoResponse> oldWeekBasedCapacityGroupResponse;
    List<WeekBasedCapacityGroupDtoResponse> newWeekBasedCapacityGroupResponse;
    List<WeekBasedMaterialDemandResponseDto> newWeekBasedMaterialDemandResponse;
    List<WeekBasedMaterialDemandResponseDto> oldWeekBasedMaterialDemandResponse;

    public StatusesServiceImpl(
        StatusesRepository statusesRepository,
        List<WeekBasedMaterialDemandResponseDto> oldWeekBasedMaterialDemandResponse,
        List<WeekBasedMaterialDemandResponseDto> newWeekBasedMaterialDemandResponse,
        List<WeekBasedCapacityGroupDtoResponse> oldWeekBasedCapacityGroupResponse,
        List<WeekBasedCapacityGroupDtoResponse> newWeekBasedCapacityGroupResponse
    ) {
        this.statusesRepository = statusesRepository;
        this.oldWeekBasedMaterialDemandResponse = oldWeekBasedMaterialDemandResponse;
        this.newWeekBasedMaterialDemandResponse = newWeekBasedMaterialDemandResponse;
        this.oldWeekBasedCapacityGroupResponse = oldWeekBasedCapacityGroupResponse;
        this.newWeekBasedCapacityGroupResponse = newWeekBasedCapacityGroupResponse;
    }

    @Override
    public StatusesResponse postStatuses(StatusRequest statusRequest) {
        StatusesEntity statusesEntity = convertDtoToEntity(statusRequest);
        statusesRepository.save(statusesEntity);
        return convertStatusesResponseDto(statusesEntity);
    }

    // TODO: remove the hardcoded id
    private StatusesEntity convertDtoToEntity(StatusRequest statusRequest) {
        StatusObjectEntity todos = StatusObjectEntity
            .builder()
            .id(UUID.fromString("21c10efa-9a75-4da9-9ef9-589d3a54b2ab"))
            .count(statusRequest.getTodos().getCount())
            .build();

        StatusObjectEntity general = StatusObjectEntity
            .builder()
            .id(UUID.fromString("526cf84f-6be3-4b06-9fd5-9da276ab6f32"))
            .count(statusRequest.getGeneral().getCount())
            .build();

        StatusObjectEntity statusImprovement = StatusObjectEntity
            .builder()
            .id(UUID.fromString("a10f808a-52e0-4375-ac1b-19eba4523c72"))
            .count(statusRequest.getStatusImprovement().getCount())
            .build();

        StatusObjectEntity statusDegredation = StatusObjectEntity
            .builder()
            .id(UUID.fromString("aeeab6ed-cdb1-434f-8886-f065ac5dafc0"))
            .count(statusRequest.getStatusDegredation().getCount())
            .build();

        return StatusesEntity
            .builder()
            .id(UUID.fromString("67bb2c53-d717-4a73-90c2-4f18984b10f7"))
            .todos(todos)
            .general(general)
            .statusImprovment(statusImprovement)
            .statusDegredation(statusDegredation)
            .build();
    }

    @Override
    public StatusesResponse getAllStatuses() {
        List<StatusesEntity> statusesEntities = statusesRepository.findAll();
        return statusesEntities.stream().map(this::convertStatusesResponseDto).toList().get(0);
    }

    private StatusesResponse convertStatusesResponseDto(StatusesEntity statusesEntity) {
        StatusesResponse responseDto = new StatusesResponse();
        StatusDto todos = new StatusDto();
        StatusDto general = new StatusDto();
        StatusDto statusImprovement = new StatusDto();
        StatusDto statusDegredation = new StatusDto();

        todos.setCount(statusesEntity.getTodos().getCount());

        general.setCount(statusesEntity.getGeneral().getCount());

        statusImprovement.setCount(statusesEntity.getStatusImprovment().getCount());

        statusDegredation.setCount(statusesEntity.getStatusDegredation().getCount());

        responseDto.setTodos(todos);
        responseDto.setGeneral(general);
        responseDto.setStatusImprovement(statusImprovement);
        responseDto.setStatusDegredation(statusDegredation);

        return responseDto;
    }

    @Override
    public void updateStatus() {
        saveStatusesData();
    }

    public void saveStatusesData() {
        StatusRequest statusRequest = new StatusRequest();

        List<MaterialCapacityQuantity> oldCapacityQuantities = new ArrayList<>();
        List<MaterialCapacityQuantity> newCapacityQuantities = new ArrayList<>();

        AtomicInteger todoCount = new AtomicInteger();
        AtomicInteger generalCount = new AtomicInteger();
        AtomicInteger statusImprovementCount = new AtomicInteger();
        AtomicInteger statusReductionCount = new AtomicInteger();
        AtomicInteger allDemandsCount = new AtomicInteger();

        Map<String, List<CapacitiesDto>> oldMaterialNumberCapacitiesMapList = createMaterialNumberCapacitiesMapList(
            oldWeekBasedCapacityGroupResponse
        );
        Map<String, List<CapacitiesDto>> newMaterialNumberCapacitiesMapList = createMaterialNumberCapacitiesMapList(
            newWeekBasedCapacityGroupResponse
        );

        Map<String, List<DemandSeriesDto>> oldMaterialNumberDemandsMapList = createMaterialNumberDemandsMapList(
            oldWeekBasedMaterialDemandResponse
        );
        Map<String, List<DemandSeriesDto>> newMaterialNumberDemandsMapList = createMaterialNumberDemandsMapList(
            newWeekBasedMaterialDemandResponse
        );

        processMaterialDemands(
            todoCount,
            true,
            newCapacityQuantities,
            newMaterialNumberDemandsMapList,
            newMaterialNumberCapacitiesMapList
        );

        processMaterialDemands(
            todoCount,
            false,
            oldCapacityQuantities,
            oldMaterialNumberDemandsMapList,
            oldMaterialNumberCapacitiesMapList
        );

        processCapacityQuantities(
            oldCapacityQuantities,
            newCapacityQuantities,
            statusReductionCount,
            statusImprovementCount
        );

        setAllDemandsCountCount(allDemandsCount, newMaterialNumberDemandsMapList);

        // set the general count
        generalCount.set(
            allDemandsCount.get() - (todoCount.get() + statusImprovementCount.get() + statusReductionCount.get())
        );

        StatusDto todos = new StatusDto();
        todos.setCount(todoCount.get());

        StatusDto generalStatusDto = new StatusDto();
        generalStatusDto.setCount(generalCount.get());

        StatusDto improvementStatusDto = new StatusDto();
        improvementStatusDto.setCount(statusImprovementCount.get());

        StatusDto degradationStatusDto = new StatusDto();
        degradationStatusDto.setCount(statusReductionCount.get());

        // Set DTOs in StatusRequest
        statusRequest.setTodos(todos);
        statusRequest.setGeneral(generalStatusDto);
        statusRequest.setStatusImprovement(improvementStatusDto);
        statusRequest.setStatusDegredation(degradationStatusDto);

        // Post the StatusRequest
        postStatuses(statusRequest);
    }

    private Map<String, List<DemandSeriesDto>> createMaterialNumberDemandsMapList(
        List<WeekBasedMaterialDemandResponseDto> weekBasedMaterialDemandEntities
    ) {
        Map<String, List<DemandSeriesDto>> materialNumberDemandsMapList = new HashMap<>();

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
                            materialNumberDemandsMapList.put(materialNumberCustomer, demandWeekSeriesDto.getDemands());
                        }
                    );
            }
        );
        return materialNumberDemandsMapList;
    }

    private Map<String, List<CapacitiesDto>> createMaterialNumberCapacitiesMapList(
        List<WeekBasedCapacityGroupDtoResponse> weekBasedCapacityGroupEntities
    ) {
        Map<String, List<CapacitiesDto>> materialNumberCapacitiesMap = new HashMap<>();

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
                            materialNumberCapacitiesMap.put(
                                linkedDemandSeriesRequest.getMaterialNumberCustomer(),
                                capacitiesDtos
                            );
                        }
                    );
            }
        );
        return materialNumberCapacitiesMap;
    }

    private void setAllDemandsCountCount(
        AtomicInteger allDemandsCount,
        Map<String, List<DemandSeriesDto>> materialNumberDemandsMap
    ) {
        for (Map.Entry<String, List<DemandSeriesDto>> materialNumberDemandsMapEntry : materialNumberDemandsMap.entrySet()) {
            allDemandsCount.set(allDemandsCount.get() + materialNumberDemandsMapEntry.getValue().size());
        }
    }

    private void processMaterialDemands(
        AtomicInteger todoCount,
        boolean isNewMaterialDemands,
        List<MaterialCapacityQuantity> capacityQuantities,
        Map<String, List<DemandSeriesDto>> materialNumberDemandsMap,
        Map<String, List<CapacitiesDto>> materialNumberCapacitiesMap
    ) {
        for (Map.Entry<String, List<DemandSeriesDto>> materialNumberDemandsMapEntry : materialNumberDemandsMap.entrySet()) {
            materialNumberDemandsMapEntry
                .getValue()
                .forEach(
                    demandSeriesDto -> {
                        if (
                            !materialNumberCapacitiesMap.containsKey(materialNumberDemandsMapEntry.getKey()) &&
                            isNewMaterialDemands
                        ) {
                            todoCount.incrementAndGet();
                        }
                        for (Map.Entry<String, List<CapacitiesDto>> materialNumberCapacitiesMapEntry : materialNumberCapacitiesMap.entrySet()) {
                            if (
                                materialNumberDemandsMapEntry.getKey().equals(materialNumberCapacitiesMapEntry.getKey())
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
                                                        Double.parseDouble(demandSeriesDto.getDemand())
                                                    )
                                                );
                                            }
                                        }
                                    );
                            }
                        }
                    }
                );
        }
    }

    // Helper method to process old and new capacity quantities and update status lists
    private void processCapacityQuantities(
        List<MaterialCapacityQuantity> oldMaterialCapacityQuantities,
        List<MaterialCapacityQuantity> newMaterialCapacityQuantities,
        AtomicInteger statusReductionCount,
        AtomicInteger statusImprovementCount
    ) {
        oldMaterialCapacityQuantities.forEach(
            oldCapacityQuantity -> {
                newMaterialCapacityQuantities.forEach(
                    newCapacityQuantity -> {
                        if (
                            oldCapacityQuantity.getCalendarWeek().getDayOfYear() ==
                            newCapacityQuantity.calendarWeek.getDayOfYear()
                        ) {
                            EventType eventType = getEventType(oldCapacityQuantity, newCapacityQuantity);

                            if (eventType == EventType.STATUS_REDUCTION) {
                                statusReductionCount.set(statusReductionCount.get() + 1);
                            } else if (eventType == EventType.STATUS_IMPROVEMENT) {
                                statusImprovementCount.set(statusImprovementCount.get() + 1);
                            }
                        }
                    }
                );
            }
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

        return StatusManager.getEventType(true, oldStatusColor, newStatusColor);
    }

    public class MaterialCapacityQuantity {

        private double maximumCapacity;
        private double actualCapacity;
        private LocalDateTime calendarWeek;
        private double demand;

        public MaterialCapacityQuantity(
            double maximumCapacity,
            double actualCapacity,
            LocalDateTime calendarWeek,
            double demand
        ) {
            this.maximumCapacity = maximumCapacity;
            this.actualCapacity = actualCapacity;
            this.calendarWeek = calendarWeek;
            this.demand = demand;
        }

        public double getMaximumCapacity() {
            return maximumCapacity;
        }

        public void setMaximumCapacity(double maximumCapacity) {
            this.maximumCapacity = maximumCapacity;
        }

        public double getActualCapacity() {
            return actualCapacity;
        }

        public void setActualCapacity(double actualCapacity) {
            this.actualCapacity = actualCapacity;
        }

        public LocalDateTime getCalendarWeek() {
            return calendarWeek;
        }

        public void setCalendarWeek(LocalDateTime calendarWeek) {
            this.calendarWeek = calendarWeek;
        }

        public double getDemand() {
            return demand;
        }

        public void setDemand(double demand) {
            this.demand = demand;
        }

        @Override
        public String toString() {
            return (
                "MaterialCapacityQuantity{" +
                "maximumCapacity=" +
                maximumCapacity +
                ", actualCapacity=" +
                actualCapacity +
                ", calendarWeek=" +
                calendarWeek +
                ", demand=" +
                demand +
                '}'
            );
        }
    }
}
