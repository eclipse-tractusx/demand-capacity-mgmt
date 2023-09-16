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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.MaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.WeekBasedCapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusesService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.WeekBasedCapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class WeekBasedCapacityGroupServiceImpl implements WeekBasedCapacityGroupService {

    private final WeekBasedCapacityGroupRepository weekBasedCapacityGroupRepository;

    private final MaterialDemandRepository materialDemandRepository;

    private final StatusesService statusesService;
    private static List<WeekBasedCapacityGroupDtoResponse> oldWeekBasedCapacityGroups;
    private static List<WeekBasedCapacityGroupDtoResponse> newWeekBasedCapacityGroups;

    @Override
    public void createWeekBasedCapacityGroup(List<WeekBasedCapacityGroupDtoRequest> weekBasedCapacityGroupRequestList) {
        weekBasedCapacityGroupRequestList.forEach(
            weekBasedCapacityGroupRequest -> {
                validateFields(weekBasedCapacityGroupRequest.getWeekBasedCapacityGroupRequest());
                WeekBasedCapacityGroupEntity weekBasedCapacityGroup = convertEntity(
                    weekBasedCapacityGroupRequest.getWeekBasedCapacityGroupRequest()
                );
                weekBasedCapacityGroupRepository.save(weekBasedCapacityGroup);
            }
        );
        statusesService.updateStatus();
    }

    @Override
    public void receiveWeekBasedCapacityGroup() {
        List<WeekBasedCapacityGroupEntity> weekBasedCapacityGroupEntities = weekBasedCapacityGroupRepository.getAllByViewed(
            false
        );

        weekBasedCapacityGroupEntities.forEach(
            weekBasedCapacityGroupEntity -> {
                WeekBasedCapacityGroupRequest weekBasedCapacityGroup = weekBasedCapacityGroupEntity.getWeekBasedCapacityGroup();

                if (weekBasedCapacityGroup != null) {
                    List<LinkedDemandSeriesRequest> likedDemandSeriesList = weekBasedCapacityGroup.getLinkedDemandSeries();

                    if (likedDemandSeriesList != null) {
                        for (LinkedDemandSeriesRequest likedDemandSeries : likedDemandSeriesList) {
                            String materialNumberCustomer = likedDemandSeries.getMaterialNumberCustomer();
                            String customerLocation = likedDemandSeries.getCustomerLocation();
                            String demandCategoryCode = likedDemandSeries.getDemandCategory().getDemandCategory();

                            List<MaterialDemandEntity> matchingDemands = materialDemandRepository.findAllByMaterialNumberCustomerAndDemandSeriesCustomerLocationAndDemandCategory(
                                materialNumberCustomer,
                                customerLocation,
                                demandCategoryCode
                            );

                            matchingDemands.forEach(
                                materialDemandEntity -> {
                                    materialDemandEntity
                                        .getDemandSeries()
                                        .forEach(
                                            demandSeries -> {
                                                demandSeries.setCapacityGroupId(
                                                    weekBasedCapacityGroup.getCapacityGroupId()
                                                );
                                            }
                                        );
                                }
                            );

                            materialDemandRepository.saveAll(matchingDemands);
                        }
                    }
                }
            }
        );
        //        statusesService.updateStatus();
    }

    @Override
    public void sendWeekBasedCapacityGroup() {}

    @Override
    public List<WeekBasedCapacityGroupDtoResponse> getWeekBasedCapacityGroups() {
        return convertToWeekBasedCapacityGroupDtoList(weekBasedCapacityGroupRepository.findAll());
    }

    @Override
    public void createWeekBasedCapacityGroupRequestFromEntity(CapacityGroupEntity capacityGroupEntity) {
        WeekBasedCapacityGroupRequest basedCapacityGroupRequest = new WeekBasedCapacityGroupRequest();

        basedCapacityGroupRequest.setCapacityGroupId(capacityGroupEntity.getCapacityGroupId().toString());
        basedCapacityGroupRequest.setUnityOfMeasure(capacityGroupEntity.getUnitMeasure().getCodeValue());
        basedCapacityGroupRequest.setCustomer(capacityGroupEntity.getCustomerId().getBpn());
        basedCapacityGroupRequest.setSupplier(capacityGroupEntity.getSupplierId().getBpn());
        basedCapacityGroupRequest.setName(capacityGroupEntity.getName());
        basedCapacityGroupRequest.setChangedAt(capacityGroupEntity.getChangedAt().toString());
        basedCapacityGroupRequest.setSupplierLocations(capacityGroupEntity.getSupplierLocation());

        List<LinkedDemandSeriesRequest> linkedDemandSeries = capacityGroupEntity
            .getLinkedDemandSeries()
            .stream()
            .map(WeekBasedCapacityGroupServiceImpl::getLinkedDemandSeries)
            .toList();
        basedCapacityGroupRequest.setLinkedDemandSeries(linkedDemandSeries);

        List<CapacitiesDto> capacitiesDtos = capacityGroupEntity
            .getCapacityTimeSeries()
            .stream()
            .map(WeekBasedCapacityGroupServiceImpl::getCapacitiesDto)
            .toList();

        basedCapacityGroupRequest.setCapacities(capacitiesDtos);
        //        statusesService.updateStatus();
    }

    @Override
    public WeekBasedCapacityGroupDtoResponse updateWeekBasedCapacityGroup(
        String id,
        WeekBasedCapacityGroupDtoRequest weekBasedCapacityGroupRequest
    ) {
        oldWeekBasedCapacityGroups = convertToWeekBasedCapacityGroupDtoList(weekBasedCapacityGroupRepository.findAll());
        WeekBasedCapacityGroupEntity weekBasedCapacityGroupEntity = convertWeekMaterialDemandToEntity(
            weekBasedCapacityGroupRequest
        );
        weekBasedCapacityGroupEntity.setId(UUID.fromString(weekBasedCapacityGroupRequest.getId()));
        weekBasedCapacityGroupEntity = weekBasedCapacityGroupRepository.save(weekBasedCapacityGroupEntity);
        newWeekBasedCapacityGroups = convertToWeekBasedCapacityGroupDtoList(weekBasedCapacityGroupRepository.findAll());
        return convertToWeekBasedCapacityGroupDto(weekBasedCapacityGroupEntity);
    }

    private WeekBasedCapacityGroupEntity convertWeekMaterialDemandToEntity(
        WeekBasedCapacityGroupDtoRequest weekBasedCapacityGroupResponses
    ) {
        WeekBasedCapacityGroupEntity weekBasedCapacityGroupEntity = new WeekBasedCapacityGroupEntity();
        weekBasedCapacityGroupEntity.setWeekBasedCapacityGroup(
            weekBasedCapacityGroupResponses.getWeekBasedCapacityGroupRequest()
        );
        weekBasedCapacityGroupEntity.setId(UUID.fromString(weekBasedCapacityGroupResponses.getId()));
        weekBasedCapacityGroupEntity.setViewed(weekBasedCapacityGroupResponses.getViewed());

        return weekBasedCapacityGroupEntity;
    }

    @Override
    public List<WeekBasedCapacityGroupDtoResponse> getOldWeekBasedCapacityGroups() {
        return oldWeekBasedCapacityGroups;
    }

    @Override
    public List<WeekBasedCapacityGroupDtoResponse> getUpdatedWeekBasedCapacityGroups() {
        return newWeekBasedCapacityGroups;
    }

    private WeekBasedCapacityGroupDtoResponse convertToWeekBasedCapacityGroupDto(
        WeekBasedCapacityGroupEntity weekBasedMaterialDemandEntity
    ) {
        WeekBasedCapacityGroupDtoResponse responseDto = new WeekBasedCapacityGroupDtoResponse();
        responseDto.setId(weekBasedMaterialDemandEntity.getId().toString());
        responseDto.setViewed(weekBasedMaterialDemandEntity.getViewed());
        responseDto.setWeekBasedCapacityGroupRequest(weekBasedMaterialDemandEntity.getWeekBasedCapacityGroup());

        return responseDto;
    }

    private List<WeekBasedCapacityGroupDtoResponse> convertToWeekBasedCapacityGroupDtoList(
        List<WeekBasedCapacityGroupEntity> weekBasedMaterialDemandEntities
    ) {
        List<WeekBasedCapacityGroupDtoResponse> weekBasedCapacityGroupList = new ArrayList<>();

        for (WeekBasedCapacityGroupEntity entity : weekBasedMaterialDemandEntities) {
            WeekBasedCapacityGroupDtoResponse responseDto = new WeekBasedCapacityGroupDtoResponse();
            responseDto = convertToWeekBasedCapacityGroupDto(entity);
            weekBasedCapacityGroupList.add(responseDto);
        }
        return weekBasedCapacityGroupList;
    }

    @Override
    public WeekBasedCapacityGroupEntity findById(String capacityGroupId) {
        Optional<WeekBasedCapacityGroupEntity> weekBasedCapacityGroupEntityOptional = weekBasedCapacityGroupRepository.findById(
            Integer.getInteger(capacityGroupId)
        );

        if (weekBasedCapacityGroupEntityOptional.isEmpty()) {
            throw new NotFoundException("WeekBasedCapacity not found");
        }

        return weekBasedCapacityGroupEntityOptional.get();
    }

    private static CapacitiesDto getCapacitiesDto(CapacityTimeSeries capacityTimeSeries) {
        CapacitiesDto capacitiesDto = new CapacitiesDto();

        capacitiesDto.setActualCapacity(capacityTimeSeries.getActualCapacity().toString());
        capacitiesDto.setMaximumCapacity(capacitiesDto.getMaximumCapacity());
        capacitiesDto.setCalendarWeek(capacitiesDto.getCalendarWeek());

        return capacitiesDto;
    }

    private static LinkedDemandSeriesRequest getLinkedDemandSeries(LinkedDemandSeries linkedDemandSeries1) {
        LinkedDemandSeriesRequest linkedDemandSeriesRequest = new LinkedDemandSeriesRequest();
        DemandCategoryDto demandCategoryDto = new DemandCategoryDto();
        demandCategoryDto.setDemandCategory(linkedDemandSeries1.getDemandCategory().getDemandCategoryCode());

        linkedDemandSeriesRequest.setDemandCategory(demandCategoryDto);
        linkedDemandSeriesRequest.setCustomerLocation(linkedDemandSeries1.getCustomerId().getBpn());
        linkedDemandSeriesRequest.setMaterialNumberCustomer(linkedDemandSeries1.getMaterialNumberCustomer());
        linkedDemandSeriesRequest.setMaterialNumberSupplier(linkedDemandSeries1.getMaterialNumberSupplier());

        return linkedDemandSeriesRequest;
    }

    private void validateFields(WeekBasedCapacityGroupRequest weekBasedCapacityGroupRequest) {
        if (!UUIDUtil.checkValidUUID(weekBasedCapacityGroupRequest.getCapacityGroupId())) {
            throw new BadRequestException("not a valid ID");
        }
    }

    private WeekBasedCapacityGroupEntity convertEntity(WeekBasedCapacityGroupRequest weekBasedCapacityGroupRequest) {
        return WeekBasedCapacityGroupEntity
            .builder()
            .id(UUID.randomUUID())
            .weekBasedCapacityGroup(weekBasedCapacityGroupRequest)
            .viewed(false)
            .build();
    }
}
