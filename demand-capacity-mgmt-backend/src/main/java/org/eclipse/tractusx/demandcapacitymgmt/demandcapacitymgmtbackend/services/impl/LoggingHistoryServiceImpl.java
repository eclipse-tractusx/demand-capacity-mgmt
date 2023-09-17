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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.FavoriteResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryResponse;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LoggingHistoryRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.DemandService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.FavoriteService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LoggingHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class LoggingHistoryServiceImpl implements LoggingHistoryService {

    private final LoggingHistoryRepository loggingHistoryRepository;
    private final CapacityGroupService capacityGroupService;
    private final DemandService demandService;
    private final FavoriteService favoriteService;

    @Override
    public List<LoggingHistoryResponse> getAllLoggingHistory() {
        List<LoggingHistoryEntity> loggingHistoryEntityList = loggingHistoryRepository.findAll();
        return loggingHistoryEntityList.stream().map(this::convertLoggingHistoryResponseDto).toList();
    }

    @Override
    public LoggingHistoryResponse createLog(LoggingHistoryRequest loggingHistoryRequest) {
        LoggingHistoryEntity loggingHistoryEntity = convertDtoToEntity(loggingHistoryRequest);
        loggingHistoryRepository.save(loggingHistoryEntity);
        return convertLoggingHistoryResponseDto(loggingHistoryEntity);
    }

    private LoggingHistoryEntity convertDtoToEntity(LoggingHistoryRequest loggingHistoryRequest) {
        CapacityGroupEntity capacityGroupEntity = capacityGroupService.getCapacityGroupEntityById(
            loggingHistoryRequest.getCapacityGroupId()
        );

        MaterialDemandEntity materialDemandEntity = demandService.getDemandEntityById(
            loggingHistoryRequest.getMaterialDemandId()
        );
        UUID id = UUID.randomUUID();

        return LoggingHistoryEntity
            .builder()
            .id(id)
            .userSpecificEventStatus(
                UserSpecificEventStatus.valueOf(loggingHistoryRequest.getUserSpecificEventStatus())
            )
            .eventStatus(EventStatus.valueOf(loggingHistoryRequest.getEventStatus()))
            .eventType(EventType.valueOf(loggingHistoryRequest.getEventType()))
            .objectType(EventObjectType.valueOf(loggingHistoryRequest.getObjectType()))
            .materialDemandId(materialDemandEntity)
            .capacityGroupId(capacityGroupEntity)
            .userAccount(loggingHistoryRequest.getUserAccount())
            .time_created(Timestamp.valueOf(loggingHistoryRequest.getTimeCreated()))
            .description(loggingHistoryRequest.getEventDescription())
            .isFavorited(loggingHistoryRequest.getIsFavorited())
            .build();
    }

    @Override
    public List<LoggingHistoryResponse> getLoggingHistoryByCapacityId(String capacityGroupId) {
        List<LoggingHistoryResponse> loggingHistoryResponses = getAllLoggingHistory();
        loggingHistoryResponses =
            loggingHistoryResponses
                .stream()
                .filter(log -> Objects.equals(log.getCapacityGroupId(), capacityGroupId))
                .collect(Collectors.toList());
        return loggingHistoryResponses;
    }

    @Override
    public List<LoggingHistoryResponse> getLoggingHistoryByMaterialDemandId(String materialDemandId) {
        List<LoggingHistoryResponse> loggingHistoryResponses = getAllLoggingHistory();
        loggingHistoryResponses =
            loggingHistoryResponses
                .stream()
                .filter(log -> Objects.equals(log.getMaterialDemandId(), materialDemandId))
                .collect(Collectors.toList());
        return loggingHistoryResponses;
    }

    //TODO, Saja: refactor the filters
    @Override
    public List<LoggingHistoryResponse> filterByTime(Timestamp startTime, Timestamp endTime) {
        List<LoggingHistoryResponse> loggingHistoryResponses = getAllLoggingHistory();
        loggingHistoryResponses =
            loggingHistoryResponses
                .stream()
                .filter(log -> isOnTimeInterval(startTime, endTime, Timestamp.valueOf(log.getTimeCreated())))
                .collect(Collectors.toList());
        return loggingHistoryResponses;
    }

    boolean isOnTimeInterval(Timestamp startTime, Timestamp endTime, Timestamp logCreationTime) {
        return logCreationTime.after(startTime) && logCreationTime.before(endTime);
    }

    @Override
    public List<LoggingHistoryResponse> filterByEventType(EventType eventType) {
        List<LoggingHistoryResponse> loggingHistoryResponses = getAllLoggingHistory();
        loggingHistoryResponses =
            loggingHistoryResponses
                .stream()
                .filter(log -> Objects.equals(log.getEventType(), eventType.name()))
                .collect(Collectors.toList());
        return loggingHistoryResponses;
    }

    @Override
    public List<LoggingHistoryResponse> getLogsFavoredByMe() {
        return null;
    }

    @Override
    public List<LoggingHistoryResponse> getLogsManagedByMe() {
        return null;
    }

    @Override
    public List<LoggingHistoryResponse> getAllEventsRelatedToMeOnly() {
        return null;
    }

    @Override
    public List<LoggingHistoryResponse> filterByFavoriteMaterialDemand() {
        List<LoggingHistoryResponse> loggingHistoryResponses = new java.util.ArrayList<>(List.of());
        List<FavoriteResponse> favoriteResponses = favoriteService
            .getAllFavoritesByType(FavoriteType.MATERIAL_DEMAND.toString());

          favoriteResponses.forEach(favoriteResponse -> {
              loggingHistoryResponses.addAll(
                      getLoggingHistoryByMaterialDemandId(favoriteResponse.getfTypeId())
              );
          });
        return loggingHistoryResponses;
    }

    @Override
    public List<LoggingHistoryResponse> filterByFavoriteCapacityGroup() {
        List<LoggingHistoryResponse> loggingHistoryResponses = new java.util.ArrayList<>(List.of());
        List<FavoriteResponse> favoriteResponses = favoriteService
                .getAllFavoritesByType(FavoriteType.CAPACITY_GROUP.toString());

        favoriteResponses.forEach(favoriteResponse -> {
            loggingHistoryResponses.addAll(
                    getLoggingHistoryByCapacityId(favoriteResponse.getfTypeId())
            );
        });
        return loggingHistoryResponses;
    }

    @Override
    public List<LoggingHistoryResponse> filterByEventStatus(EventStatus eventStatus) {
        List<LoggingHistoryResponse> loggingHistoryResponses = getAllLoggingHistory();
        loggingHistoryResponses =
            loggingHistoryResponses
                .stream()
                .filter(log -> Objects.equals(log.getEventStatus(), eventStatus.name()))
                .collect(Collectors.toList());
        return loggingHistoryResponses;
    }

    private LoggingHistoryResponse convertLoggingHistoryResponseDto(LoggingHistoryEntity loggingHistoryEntity) {
        LoggingHistoryResponse responseDto = new LoggingHistoryResponse();

        responseDto.setId(loggingHistoryEntity.getId().toString());
        responseDto.setEventDescription(loggingHistoryEntity.getDescription());
        responseDto.setUserSpecificEventStatus(loggingHistoryEntity.getUserSpecificEventStatus().toString());
        responseDto.setUserAccount(loggingHistoryEntity.getUserAccount());
        responseDto.setIsFavorited(loggingHistoryEntity.getIsFavorited());
        responseDto.setEventType(loggingHistoryEntity.getEventType().toString());
        responseDto.setCapacityGroupId(loggingHistoryEntity.getCapacityGroupId().getId().toString());
        responseDto.setEventStatus(loggingHistoryEntity.getEventStatus().toString());
        responseDto.setMaterialDemandId(loggingHistoryEntity.getMaterialDemandId().getId().toString());
        responseDto.setObjectType(loggingHistoryEntity.getObjectType().toString());
        responseDto.setTimeCreated(loggingHistoryEntity.getTime_created().toString());

        return responseDto;
    }
}
