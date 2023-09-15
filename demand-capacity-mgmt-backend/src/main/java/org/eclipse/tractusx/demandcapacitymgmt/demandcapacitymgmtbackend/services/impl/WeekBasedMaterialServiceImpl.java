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
import java.util.LinkedList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.WeekBasedCapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.WeekBasedMaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.WeekBasedMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LinkDemandService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusesService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.WeekBasedMaterialService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.DataConverterUtil;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class WeekBasedMaterialServiceImpl implements WeekBasedMaterialService {

    private final WeekBasedMaterialDemandRepository weekBasedMaterialDemandRepository;

    private final LinkDemandService linkDemandService;

    private final StatusesService statusesService;

    @Override
    public void createWeekBasedMaterial(List<WeekBasedMaterialDemandRequestDto> weekBasedMaterialDemandRequestDtoList) {
        weekBasedMaterialDemandRequestDtoList.forEach(
            weekBasedMaterialDemandRequestDto -> {
                validateFields(weekBasedMaterialDemandRequestDto);

                WeekBasedMaterialDemandEntity weekBasedMaterialDemand = convertEntity(
                    weekBasedMaterialDemandRequestDto
                );
                weekBasedMaterialDemandRepository.save(weekBasedMaterialDemand);
            }
        );
        statusesService.updateStatus();
    }

    @Override
    public void sendWeekBasedMaterial() {}

    @Override
    public void receiveWeekBasedMaterial() {
        List<WeekBasedMaterialDemandEntity> weekBasedMaterialDemandEntities = weekBasedMaterialDemandRepository.getAllByViewed(
            false
        );
        statusesService.updateStatus();
        linkDemandService.createLinkDemands(weekBasedMaterialDemandEntities);
    }

    @Override
    public List<WeekBasedMaterialDemandResponseDto> getWeekBasedMaterialDemandGroups() {
        return convertToWeekCapacityGroupDto(weekBasedMaterialDemandRepository.findAll());
    }


    private List<WeekBasedMaterialDemandResponseDto> convertToWeekCapacityGroupDto(List<WeekBasedMaterialDemandEntity> weekBasedCapacityGroupEntities) {
        List<WeekBasedMaterialDemandResponseDto> weekBasedCapacityGroupList = new ArrayList<>();

        for (WeekBasedMaterialDemandEntity entity : weekBasedCapacityGroupEntities) {
            WeekBasedMaterialDemandResponseDto responseDto = new WeekBasedMaterialDemandResponseDto();
            WeekBasedMaterialDemandRequestDto weekBasedMaterialDemandRequestDto = entity.getWeekBasedMaterialDemand();

        responseDto.setCustomer(weekBasedMaterialDemandRequestDto.getCustomer());
        responseDto.setSupplier(weekBasedMaterialDemandRequestDto.getSupplier());
        responseDto.setChangedAt(weekBasedMaterialDemandRequestDto.getChangedAt());
        responseDto.setMaterialDemandId(weekBasedMaterialDemandRequestDto.getMaterialDemandId());
        responseDto.setDemandSeries(weekBasedMaterialDemandRequestDto.getDemandSeries());
        responseDto.setUnityOfMeasure(weekBasedMaterialDemandRequestDto.getUnityOfMeasure());
        responseDto.setMaterialNumberCustomer(weekBasedMaterialDemandRequestDto.getMaterialNumberCustomer());
        responseDto.setMaterialDescriptionCustomer(weekBasedMaterialDemandRequestDto.getMaterialDescriptionCustomer());
        responseDto.setMaterialNumberSupplier(weekBasedMaterialDemandRequestDto.getMaterialNumberSupplier());
        weekBasedCapacityGroupList.add(responseDto);
    }
        return weekBasedCapacityGroupList;
    }

    @Override
    public ResponseEntity<WeekBasedMaterialDemandResponseDto> updateWeekBasedMaterial(
        String id,
        WeekBasedMaterialDemandRequestDto weekBasedMaterialDemandRequestDto
    ) {

        //TODO: update here
        return null;
    }

    @Override
    public void createWeekBasedMaterialRequestFromEntity(MaterialDemandEntity materialDemandEntity) {
        WeekBasedMaterialDemandRequestDto basedMaterialDemandRequestDto = new WeekBasedMaterialDemandRequestDto();

        basedMaterialDemandRequestDto.setMaterialDemandId(materialDemandEntity.getId().toString());
        basedMaterialDemandRequestDto.setMaterialNumberCustomer(materialDemandEntity.getMaterialNumberCustomer());
        basedMaterialDemandRequestDto.setMaterialDescriptionCustomer(
            materialDemandEntity.getMaterialDescriptionCustomer()
        );
        basedMaterialDemandRequestDto.setCustomer(materialDemandEntity.getCustomerId().getBpn());
        basedMaterialDemandRequestDto.setSupplier(materialDemandEntity.getSupplierId().getBpn());
        basedMaterialDemandRequestDto.setUnityOfMeasure(materialDemandEntity.getUnitMeasure().getCodeValue());

        List<DemandWeekSeriesDto> demandWeekSeriesDtoList = new LinkedList<>();

        materialDemandEntity
            .getDemandSeries()
            .forEach(
                demandSeries -> {
                    DemandWeekSeriesDto demandWeekSeriesDto = new DemandWeekSeriesDto();

                    demandWeekSeriesDto.setCustomerLocation(demandSeries.getCustomerLocation().getBpn());
                    demandWeekSeriesDto.setExpectedSupplierLocation(
                        demandSeries.getExpectedSupplierLocation().toString()
                    );

                    DemandSeriesCategoryDto demandSeriesCategoryDto = new DemandSeriesCategoryDto();
                    demandSeriesCategoryDto.setId(demandSeries.getDemandCategory().getId().toString());

                    demandWeekSeriesDto.setDemandCategory(demandSeriesCategoryDto);

                    List<DemandSeriesDto> demandSeriesDtos = demandSeries
                        .getDemandSeriesValues()
                        .stream()
                        .map(
                            demandSeriesValues -> {
                                DemandSeriesDto demandSeriesDto = new DemandSeriesDto();

                                demandSeriesDto.setCalendarWeek(demandSeriesValues.getCalendarWeek().toString());
                                demandSeriesValues.setDemand(demandSeriesValues.getDemand());

                                return demandSeriesDto;
                            }
                        )
                        .toList();

                    demandWeekSeriesDto.setDemands(demandSeriesDtos);

                    demandWeekSeriesDtoList.add(demandWeekSeriesDto);
                }
            );
        statusesService.updateStatus();
    }

    private void validateFields(WeekBasedMaterialDemandRequestDto weekBasedMaterialDemandRequestDto) {
        if (!UUIDUtil.checkValidUUID(weekBasedMaterialDemandRequestDto.getMaterialDemandId())) {
            throw new BadRequestException("not a valid ID");
        }

        weekBasedMaterialDemandRequestDto
            .getDemandSeries()
            .forEach(
                demandWeekSeriesDto ->
                    demandWeekSeriesDto
                        .getDemands()
                        .forEach(
                            demandSeriesDto -> {
                                if (!DataConverterUtil.itsMonday(demandSeriesDto.getCalendarWeek())) {
                                    throw new BadRequestException("not a valid date");
                                }
                            }
                        )
            );
    }

    private WeekBasedMaterialDemandEntity convertEntity(
        WeekBasedMaterialDemandRequestDto weekBasedMaterialDemandRequestDto
    ) {
        return WeekBasedMaterialDemandEntity
            .builder()
            .weekBasedMaterialDemand(weekBasedMaterialDemandRequestDto)
            .viewed(false)
            .build();
    }
}
