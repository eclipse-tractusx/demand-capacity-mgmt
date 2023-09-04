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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandSeriesCategoryDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandSeriesDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandWeekSeriesDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekBasedMaterialDemandRequestDto;
import java.util.LinkedList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.WeekBasedMaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.WeekBasedMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LinkDemandService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.WeekBasedMaterialService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.DataConverterUtil;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class WeekBasedMaterialServiceImpl implements WeekBasedMaterialService {

    private final WeekBasedMaterialDemandRepository weekBasedMaterialDemandRepository;

    private final LinkDemandService linkDemandService;

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
    }

    @Override
    public void sendWeekBasedMaterial() {}

    @Override
    public void receiveWeekBasedMaterial() {
        List<WeekBasedMaterialDemandEntity> weekBasedMaterialDemandEntities = weekBasedMaterialDemandRepository.getAllByViewed(
            false
        );

        linkDemandService.createLinkDemands(weekBasedMaterialDemandEntities);
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
