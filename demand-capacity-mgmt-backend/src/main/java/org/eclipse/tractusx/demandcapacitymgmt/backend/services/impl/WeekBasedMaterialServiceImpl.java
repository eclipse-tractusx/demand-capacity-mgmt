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

package org.eclipse.tractusx.demandcapacitymgmt.backend.services.impl;

import eclipse.tractusx.demandcapacitymgm.specification.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.WeekBasedMaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.backend.exceptions.type.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.backend.repositories.WeekBasedMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.LoggingHistoryService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.WeekBasedMaterialService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.DataConverterUtil;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class WeekBasedMaterialServiceImpl implements WeekBasedMaterialService {

    private final WeekBasedMaterialDemandRepository weekBasedMaterialDemandRepository;
    private final LoggingHistoryService loggingHistoryService;
    private List<WeekBasedMaterialDemandResponseDto> oldWeekBasedMaterialDemands;
    private List<WeekBasedMaterialDemandResponseDto> newWeekBasedMaterialDemands;

    @Override
    public void createWeekBasedMaterial(
        List<WeekBasedMaterialDemandRequestDto> weekBasedMaterialDemandRequestDtoList,
        String userID
    ) {
		oldWeekBasedMaterialDemands = DataConverterUtil.convertToWeekBasedMaterialDemandDtoList(
			weekBasedMaterialDemandRepository.findAll()
		);
		weekBasedMaterialDemandRequestDtoList.forEach(weekBasedMaterialDemandRequestDto -> {
			validateFields(weekBasedMaterialDemandRequestDto);

			WeekBasedMaterialDemandEntity weekBasedMaterialDemand = convertEntity(
				weekBasedMaterialDemandRequestDto.getWeekBasedMaterialDemandRequest()
			);
			postLogs(weekBasedMaterialDemand.getId().toString());
			weekBasedMaterialDemandRepository.save(weekBasedMaterialDemand);
		});
		newWeekBasedMaterialDemands = DataConverterUtil.convertToWeekBasedMaterialDemandDtoList(
			weekBasedMaterialDemandRepository.findAll()
        );
    }

    private void postLogs(String weekBasedMaterialDemandId) {
        LoggingHistoryRequest loggingHistoryRequest = new LoggingHistoryRequest();
        loggingHistoryRequest.setObjectType(EventObjectType.WEEKLY_MATERIAL_DEMAND.name());
        loggingHistoryRequest.setMaterialDemandId(weekBasedMaterialDemandId);
        loggingHistoryRequest.setIsFavorited(false);
        loggingHistoryRequest.setEventDescription("WEEKLY_MATERIAL_DEMAND Created");
        //TODO: Add Event
        loggingHistoryRequest.setEventType(EventType.GENERAL_EVENT.toString());

        loggingHistoryService.createLog(loggingHistoryRequest);
    }

    @Override
    public void sendWeekBasedMaterial() {}

    @Override
    public void receiveWeekBasedMaterial() {
		List<WeekBasedMaterialDemandEntity> weekBasedMaterialDemandEntities =
			weekBasedMaterialDemandRepository.getAllByViewed(false);
    }

    @Override
    public List<WeekBasedMaterialDemandResponseDto> getOldWeekBasedMaterialDemands() {
        return oldWeekBasedMaterialDemands;
    }

    @Override
    public List<WeekBasedMaterialDemandResponseDto> getUpdatedWeekBasedMaterialDemands() {
        return newWeekBasedMaterialDemands;
    }

    private WeekBasedMaterialDemandResponseDto convertToWeekBasedCapacityGroupDto(
        WeekBasedMaterialDemandEntity weekBasedMaterialDemandEntity
    ) {
        WeekBasedMaterialDemandResponseDto responseDto = new WeekBasedMaterialDemandResponseDto();
        responseDto.setId(weekBasedMaterialDemandEntity.getId().toString());
        responseDto.setViewed(weekBasedMaterialDemandEntity.getViewed());
        responseDto.setWeekBasedMaterialDemandRequest(weekBasedMaterialDemandEntity.getWeekBasedMaterialDemand());

        return responseDto;
    }

    @Override
    public WeekBasedMaterialDemandResponseDto updateWeekBasedMaterial(
        String id,
        WeekBasedMaterialDemandRequestDto weekBasedCapacityGroupRequest,
        String userID
    ) {
		oldWeekBasedMaterialDemands = DataConverterUtil.convertToWeekBasedMaterialDemandDtoList(
			weekBasedMaterialDemandRepository.findAll()
		);
        WeekBasedMaterialDemandEntity weekBasedCapacityGroupEntity = convertWeekMaterialDemandToEntity(
            weekBasedCapacityGroupRequest
        );
        weekBasedCapacityGroupEntity.setId(UUID.fromString(id));
        weekBasedCapacityGroupEntity = weekBasedMaterialDemandRepository.save(weekBasedCapacityGroupEntity);
		newWeekBasedMaterialDemands = DataConverterUtil.convertToWeekBasedMaterialDemandDtoList(
			weekBasedMaterialDemandRepository.findAll()
		);
        return convertToWeekBasedCapacityGroupDto(weekBasedCapacityGroupEntity);
    }

    private WeekBasedMaterialDemandEntity convertWeekMaterialDemandToEntity(
        WeekBasedMaterialDemandRequestDto weekBasedMaterialDemandRequestDto
    ) {
        WeekBasedMaterialDemandEntity weekBasedMaterialDemand = new WeekBasedMaterialDemandEntity();
        weekBasedMaterialDemand.setWeekBasedMaterialDemand(
            weekBasedMaterialDemandRequestDto.getWeekBasedMaterialDemandRequest()
        );
        weekBasedMaterialDemand.setViewed(weekBasedMaterialDemandRequestDto.getViewed());

        return weekBasedMaterialDemand;
    }

    public List<WeekBasedMaterialDemandResponseDto> getWeekBasedMaterialDemands() {
        return DataConverterUtil.convertToWeekBasedMaterialDemandDtoList(weekBasedMaterialDemandRepository.findAll());
    }

    @Override
    public void createWeekBasedMaterialRequestFromEntity(MaterialDemandEntity materialDemandEntity, String userID) {
        List<DemandWeekSeriesDto> demandWeekSeriesDtoList = new LinkedList<>();

        materialDemandEntity
            .getDemandSeries()
			.forEach(demandSeries -> {
				DemandWeekSeriesDto demandWeekSeriesDto = new DemandWeekSeriesDto();

				demandWeekSeriesDto.setCustomerLocation(demandSeries.getCustomerLocation().getBpn());
				demandWeekSeriesDto.setExpectedSupplierLocation(demandSeries.getExpectedSupplierLocation().toString());

				DemandSeriesCategoryDto demandSeriesCategoryDto = new DemandSeriesCategoryDto();
				demandSeriesCategoryDto.setId(demandSeries.getDemandCategory().getId().toString());

				demandWeekSeriesDto.setDemandCategory(demandSeriesCategoryDto);

				List<DemandSeriesDto> demandSeriesDtos = demandSeries
					.getDemandSeriesValues()
					.stream()
					.map(demandSeriesValues -> {
						DemandSeriesDto demandSeriesDto = new DemandSeriesDto();

						demandSeriesDto.setCalendarWeek(demandSeriesValues.getCalendarWeek().toString());
						demandSeriesValues.setDemand(demandSeriesValues.getDemand());

						return demandSeriesDto;
					})
					.toList();

				demandWeekSeriesDto.setDemands(demandSeriesDtos);

				demandWeekSeriesDtoList.add(demandWeekSeriesDto);
			});
    }

    private void validateFields(WeekBasedMaterialDemandRequestDto weekBasedMaterialDemandRequestDto) {
        if (
            !UUIDUtil.checkValidUUID(
                weekBasedMaterialDemandRequestDto.getWeekBasedMaterialDemandRequest().getMaterialDemandId()
            )
        ) {
            throw new BadRequestException("4", "04");
        }

        weekBasedMaterialDemandRequestDto
            .getWeekBasedMaterialDemandRequest()
            .getDemandSeries()
			.forEach(demandWeekSeriesDto ->
				demandWeekSeriesDto
					.getDemands()
					.forEach(demandSeriesDto -> {
						if (Boolean.FALSE.equals(DataConverterUtil.itsMonday(demandSeriesDto.getCalendarWeek()))) {
							throw new BadRequestException("1", "11");
						}
					}));
    }

    private WeekBasedMaterialDemandEntity convertEntity(WeekBasedMaterialDemandRequest weekBasedMaterialDemandRequest) {
		return WeekBasedMaterialDemandEntity.builder()
            .id(UUID.randomUUID())
            .weekBasedMaterialDemand(weekBasedMaterialDemandRequest)
            .viewed(false)
            .build();
    }
}
