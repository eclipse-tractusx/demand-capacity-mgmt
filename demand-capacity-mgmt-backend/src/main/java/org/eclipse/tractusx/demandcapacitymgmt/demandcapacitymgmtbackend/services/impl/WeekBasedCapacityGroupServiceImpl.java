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
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.WeekBasedCapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.MaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.WeekBasedCapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LoggingHistoryService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.WeekBasedCapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.DataConverterUtil;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class WeekBasedCapacityGroupServiceImpl implements WeekBasedCapacityGroupService {

    private final WeekBasedCapacityGroupRepository weekBasedCapacityGroupRepository;

    private final MaterialDemandRepository materialDemandRepository;

    private final LoggingHistoryService loggingHistoryService;

    @Override
    public void createWeekBasedCapacityGroup(
        List<WeekBasedCapacityGroupDtoRequest> weekBasedCapacityGroupRequestList,
        String userID
    ) {
        weekBasedCapacityGroupRequestList.forEach(
            weekBasedCapacityGroupRequest -> {
                validateFields(weekBasedCapacityGroupRequest.getWeekBasedCapacityGroupRequest());
                WeekBasedCapacityGroupEntity weekBasedCapacityGroup = convertEntity(
                    weekBasedCapacityGroupRequest.getWeekBasedCapacityGroupRequest()
                );
                postLogs(weekBasedCapacityGroup.getId().toString());
                weekBasedCapacityGroupRepository.save(weekBasedCapacityGroup);
            }
        );
    }

    private void postLogs(String weekBasedCapacityGroupId) {
        LoggingHistoryRequest loggingHistoryRequest = new LoggingHistoryRequest();
        loggingHistoryRequest.setObjectType(EventObjectType.WEEKLY_BASED_CAPACITY_GROUP.name());
        loggingHistoryRequest.setMaterialDemandId(weekBasedCapacityGroupId);
        loggingHistoryRequest.setIsFavorited(false);
        loggingHistoryRequest.setEventDescription("WEEKLY_BASED_CAPACITY_GROUP Created");
        loggingHistoryRequest.setEventType(EventType.GENERAL_EVENT.toString());
        loggingHistoryService.createLog(loggingHistoryRequest);
    }

    @Override
    public void receiveWeekBasedCapacityGroup() {
        try {
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
                                    materialDemandEntity ->
                                        materialDemandEntity
                                            .getDemandSeries()
                                            .forEach(
                                                demandSeries -> {
                                                    demandSeries.setCapacityGroupId(
                                                        weekBasedCapacityGroup.getCapacityGroupId()
                                                    );
                                                }
                                            )
                                );

                                materialDemandRepository.saveAll(matchingDemands);
                            }
                        }
                    }
                }
            );
            // updateStatus(); TODO: remove the comment when the EDC is ready
        } catch (Exception e) {
            //Probably sql initialize error here.
        }
    }

    @Override
    public List<WeekBasedCapacityGroupDtoResponse> getWeekBasedCapacityGroups() {
        return DataConverterUtil.convertToWeekBasedCapacityGroupDtoList(weekBasedCapacityGroupRepository.findAll());
    }

    @Override
    public void sendWeekBasedCapacityGroup() {}

    @Override
    public void createWeekBasedCapacityGroupRequestFromEntity(CapacityGroupEntity capacityGroupEntity, String userID) {
        WeekBasedCapacityGroupRequest basedCapacityGroupRequest = new WeekBasedCapacityGroupRequest();

        basedCapacityGroupRequest.setCapacityGroupId(capacityGroupEntity.getId().toString());
        basedCapacityGroupRequest.setCustomer(capacityGroupEntity.getCustomer().getBpn());
        basedCapacityGroupRequest.setSupplier(capacityGroupEntity.getSupplier().getBpn());
        basedCapacityGroupRequest.setName(capacityGroupEntity.getCapacityGroupName());
    }

    @Override
    public WeekBasedCapacityGroupDtoResponse updateWeekBasedCapacityGroup(
        String id,
        WeekBasedCapacityGroupDtoRequest weekBasedCapacityGroupRequest,
        String userID
    ) {
        WeekBasedCapacityGroupEntity weekBasedCapacityGroupEntity = convertWeekMaterialDemandToEntity(
            weekBasedCapacityGroupRequest
        );
        weekBasedCapacityGroupEntity.setId(UUID.fromString(id));
        weekBasedCapacityGroupEntity = weekBasedCapacityGroupRepository.save(weekBasedCapacityGroupEntity);
        return convertToWeekBasedCapacityGroupDto(weekBasedCapacityGroupEntity);
    }

    private WeekBasedCapacityGroupEntity convertWeekMaterialDemandToEntity(
        WeekBasedCapacityGroupDtoRequest weekBasedCapacityGroupResponses
    ) {
        WeekBasedCapacityGroupEntity weekBasedCapacityGroupEntity = new WeekBasedCapacityGroupEntity();
        weekBasedCapacityGroupEntity.setWeekBasedCapacityGroup(
            weekBasedCapacityGroupResponses.getWeekBasedCapacityGroupRequest()
        );
        weekBasedCapacityGroupEntity.setViewed(weekBasedCapacityGroupResponses.getViewed());

        return weekBasedCapacityGroupEntity;
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

    @Override
    public WeekBasedCapacityGroupEntity findById(String capacityGroupId) {
        Optional<WeekBasedCapacityGroupEntity> weekBasedCapacityGroupEntityOptional = weekBasedCapacityGroupRepository.findById(
            Integer.getInteger(capacityGroupId)
        );

        if (weekBasedCapacityGroupEntityOptional.isEmpty()) {
            throw new NotFoundException(
                404,
                "Weekly based capacity group not found",
                new ArrayList<>(List.of("the capacity group ID provided - " + capacityGroupId))
            );
        }

        return weekBasedCapacityGroupEntityOptional.get();
    }

    private void validateFields(WeekBasedCapacityGroupRequest weekBasedCapacityGroupRequest) {
        if (!UUIDUtil.checkValidUUID(weekBasedCapacityGroupRequest.getCapacityGroupId())) {
            throw new BadRequestException(
                400,
                "The ID provided is not valid, check UUID",
                new ArrayList<>(List.of("the provided ID - " + weekBasedCapacityGroupRequest.getCapacityGroupId()))
            );
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
