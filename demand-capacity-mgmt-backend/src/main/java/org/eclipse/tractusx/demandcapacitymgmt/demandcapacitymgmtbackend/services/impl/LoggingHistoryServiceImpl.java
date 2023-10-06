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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.ArchivedLoggingHistoryResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.FavoriteResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.ArchivedLogsRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LoggingHistoryRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.FavoriteService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LoggingHistoryService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.CookieUtil;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class LoggingHistoryServiceImpl implements LoggingHistoryService {

    private final LoggingHistoryRepository loggingHistoryRepository;
    private final ArchivedLogsRepository archivedLogsRepository;
    private final FavoriteService favoriteService;
    private final HttpServletRequest request;

    @Override
    public List<LoggingHistoryResponse> getAllLoggingHistory() {
        List<LoggingHistoryEntity> loggingHistoryEntityList = loggingHistoryRepository.findAll();
        return loggingHistoryEntityList.stream().map(this::convertLoggingHistoryResponseDto).toList();
    }

    @Override
    public LoggingHistoryResponse createLog(LoggingHistoryRequest loggingHistoryRequest) {
        loggingHistoryRequest.setUserAccount(CookieUtil.getUserName());
        LocalDateTime currentLocalDateTime = LocalDateTime.now();
        loggingHistoryRequest.setTimeCreated(Timestamp.valueOf(currentLocalDateTime).toString());
        LoggingHistoryEntity loggingHistoryEntity = convertDtoToEntity(loggingHistoryRequest);
        loggingHistoryRepository.save(loggingHistoryEntity);
        return convertLoggingHistoryResponseDto(loggingHistoryEntity);
    }

    @Override
    public void deleteLogById(String logId) {
        loggingHistoryRepository.deleteById(UUID.fromString(logId));
    }

    @Override
    public void deleteAllLogs() {
        loggingHistoryRepository.deleteAll();
    }

    @Override
    public void archiveLog(LoggingHistoryRequest loggingHistoryRequest) {
        ArchivedLogEntity archivedLogEntity = convertDtoToArchivedEntity(loggingHistoryRequest);
        archivedLogsRepository.save(archivedLogEntity);
    }

    @Override
    public List<ArchivedLoggingHistoryResponse> getAllArchivedLogs() {
        List<ArchivedLogEntity> loggingHistoryEntityList = archivedLogsRepository.findAll();
        return loggingHistoryEntityList.stream().map(this::convertArchivedLoggingHistoryResponseDto).toList();
    }

    @Override
    public void deleteAllArchivedLogs() {
        archivedLogsRepository.deleteAll();
    }

    @Override
    public void deleteArchivedLogById(String logId) {
        archivedLogsRepository.deleteById(UUID.fromString(logId));
    }

    private LoggingHistoryEntity convertDtoToEntity(LoggingHistoryRequest loggingHistoryRequest) {
        LoggingHistoryEntity loggingHistoryEntity = new LoggingHistoryEntity();
        loggingHistoryEntity.setId(UUID.randomUUID());
        loggingHistoryEntity.setEventType(EventType.valueOf(loggingHistoryRequest.getEventType()));
        loggingHistoryEntity.setObjectType(EventObjectType.valueOf(loggingHistoryRequest.getObjectType()));
        if (loggingHistoryRequest.getMaterialDemandId() != null) {
            loggingHistoryEntity.setMaterialDemandId(UUID.fromString(loggingHistoryRequest.getMaterialDemandId()));
        }

        if (loggingHistoryRequest.getCapacityGroupId() != null) {
            loggingHistoryEntity.setCapacityGroupId(UUID.fromString(loggingHistoryRequest.getCapacityGroupId()));
        }
        loggingHistoryEntity.setUserAccount(loggingHistoryRequest.getUserAccount());
        loggingHistoryEntity.setTime_created(Timestamp.valueOf(loggingHistoryRequest.getTimeCreated()));
        loggingHistoryEntity.setDescription(loggingHistoryRequest.getEventDescription());
        loggingHistoryEntity.setIsFavorited(loggingHistoryRequest.getIsFavorited());

        return loggingHistoryEntity;
    }

    private ArchivedLogEntity convertDtoToArchivedEntity(LoggingHistoryRequest loggingHistoryRequest) {
        ArchivedLogEntity loggingHistoryEntity = new ArchivedLogEntity();
        loggingHistoryEntity.setId(UUID.randomUUID());
        loggingHistoryEntity.setEventType(EventType.valueOf(loggingHistoryRequest.getEventType()));
        loggingHistoryEntity.setObjectType(EventObjectType.valueOf(loggingHistoryRequest.getObjectType()));
        if (loggingHistoryRequest.getMaterialDemandId() != null) {
            loggingHistoryEntity.setMaterialDemandId(UUID.fromString(loggingHistoryRequest.getMaterialDemandId()));
        }

        if (loggingHistoryRequest.getCapacityGroupId() != null) {
            loggingHistoryEntity.setCapacityGroupId(UUID.fromString(loggingHistoryRequest.getCapacityGroupId()));
        }
        loggingHistoryEntity.setUserAccount(loggingHistoryRequest.getUserAccount());
        loggingHistoryEntity.setTime_created(Timestamp.valueOf(loggingHistoryRequest.getTimeCreated()));
        loggingHistoryEntity.setDescription(loggingHistoryRequest.getEventDescription());
        loggingHistoryEntity.setIsFavorited(loggingHistoryRequest.getIsFavorited());

        return loggingHistoryEntity;
    }

    //    @Override
    public List<LoggingHistoryResponse> getLoggingHistoryByCapacityId(String capacityGroupId) {
        List<LoggingHistoryResponse> loggingHistoryResponses = getAllLoggingHistory();
        loggingHistoryResponses =
            loggingHistoryResponses
                .stream()
                .filter(log -> (Objects.equals(log.getCapacityGroupId(), capacityGroupId)))
                .collect(Collectors.toList());
        return loggingHistoryResponses;
    }

    //    @Override
    public List<LoggingHistoryResponse> getLoggingHistoryByMaterialDemandId(String materialDemandId) {
        List<LoggingHistoryResponse> loggingHistoryResponses = getAllLoggingHistory();
        loggingHistoryResponses =
            loggingHistoryResponses
                .stream()
                .filter(log -> Objects.equals(log.getMaterialDemandId(), materialDemandId))
                .collect(Collectors.toList());
        return loggingHistoryResponses;
    }

    @Override
    public List<LoggingHistoryResponse> filterLog(
        String capacityGroupId,
        String materialDemandId,
        String filterText,
        String startTime,
        String endTime
    ) {
        Timestamp startTimeStamp;
        Timestamp endTimeStamp;
        if (!(startTime.isEmpty() && endTime.isEmpty())) {
            startTimeStamp = new Timestamp(Long.parseLong(startTime) * 1000L);
            endTimeStamp = new Timestamp(Long.parseLong(endTime) * 1000L);
        } else {
            startTimeStamp = null;
            endTimeStamp = null;
        }
        List<LoggingHistoryResponse> loggingHistoryResponses = getAllLoggingHistory();
        loggingHistoryResponses =
            loggingHistoryResponses
                .stream()
                .filter(
                    log ->
                        (
                            isOnTimeInterval(startTimeStamp, endTimeStamp, Timestamp.valueOf(log.getTimeCreated())) ||
                            isMatchesId(capacityGroupId, materialDemandId, log) ||
                            containsEventText(filterText, log)
                        )
                )
                .collect(Collectors.toList());
        return loggingHistoryResponses;
    }

    private static boolean isMatchesId(String capacityGroupId, String materialDemandId, LoggingHistoryResponse log) {
        if (!(capacityGroupId.isEmpty()) && Objects.equals(log.getCapacityGroupId(), capacityGroupId)) {
            return true;
        }
        return !(materialDemandId.isEmpty()) && Objects.equals(log.getMaterialDemandId(), materialDemandId);
    }

    private static boolean containsEventText(String filterText, LoggingHistoryResponse log) {
        if (filterText != null && !filterText.isEmpty()) {
            return log.getEventType().contains(filterText) || log.getEventDescription().contains(filterText);
        }
        return false;
    }

    boolean isOnTimeInterval(Timestamp startTime, Timestamp endTime, Timestamp logCreationTime) {
        if (startTime == null || endTime == null) {
            return false;
        }
        return logCreationTime.after(startTime) && logCreationTime.before(endTime);
    }

    @Override
    public List<LoggingHistoryResponse> getLogsManagedByMe() {
        return null;
    }

    @Override
    public List<LoggingHistoryResponse> filterByFavoriteMaterialDemand() {
        List<LoggingHistoryResponse> loggingHistoryResponses = new java.util.ArrayList<>(List.of());
        List<FavoriteResponse> favoriteResponses = favoriteService.getAllFavoritesByType(
            FavoriteType.MATERIAL_DEMAND.toString()
        );

        favoriteResponses.forEach(
            favoriteResponse -> {
                loggingHistoryResponses.addAll(getLoggingHistoryByMaterialDemandId(favoriteResponse.getfTypeId()));
            }
        );
        return loggingHistoryResponses;
    }

    @Override
    public List<LoggingHistoryResponse> filterByFavoriteCapacityGroup() {
        List<LoggingHistoryResponse> loggingHistoryResponses = new java.util.ArrayList<>(List.of());
        List<FavoriteResponse> favoriteResponses = favoriteService.getAllFavoritesByType(
            FavoriteType.CAPACITY_GROUP.toString()
        );

        favoriteResponses.forEach(
            favoriteResponse -> {
                loggingHistoryResponses.addAll(getLoggingHistoryByCapacityId(favoriteResponse.getfTypeId()));
            }
        );
        return loggingHistoryResponses;
    }

    private LoggingHistoryResponse convertLoggingHistoryResponseDto(LoggingHistoryEntity loggingHistoryEntity) {
        LoggingHistoryResponse responseDto = new LoggingHistoryResponse();

        responseDto.setId(loggingHistoryEntity.getId().toString());
        responseDto.setEventDescription(loggingHistoryEntity.getDescription());
        responseDto.setUserAccount(loggingHistoryEntity.getUserAccount());
        responseDto.setIsFavorited(loggingHistoryEntity.getIsFavorited());
        responseDto.setEventType(String.valueOf(loggingHistoryEntity.getEventType()));
        responseDto.setCapacityGroupId(String.valueOf(loggingHistoryEntity.getCapacityGroupId()));
        responseDto.setMaterialDemandId(String.valueOf(loggingHistoryEntity.getMaterialDemandId()));
        responseDto.setObjectType(String.valueOf(loggingHistoryEntity.getObjectType()));
        responseDto.setTimeCreated(String.valueOf(loggingHistoryEntity.getTime_created()));

        return responseDto;
    }

    private ArchivedLoggingHistoryResponse convertArchivedLoggingHistoryResponseDto(
        ArchivedLogEntity archivedLogEntity
    ) {
        ArchivedLoggingHistoryResponse responseDto = new ArchivedLoggingHistoryResponse();

        responseDto.setId(archivedLogEntity.getId().toString());
        responseDto.setEventDescription(archivedLogEntity.getDescription());
        responseDto.setUserAccount(archivedLogEntity.getUserAccount());
        responseDto.setIsFavorited(archivedLogEntity.getIsFavorited());
        responseDto.setEventType(archivedLogEntity.getEventType().toString());
        if (archivedLogEntity.getCapacityGroupId() != null) {
            responseDto.setCapacityGroupId(archivedLogEntity.getCapacityGroupId().toString());
        }
        responseDto.setMaterialDemandId(Objects.requireNonNull(archivedLogEntity.getMaterialDemandId()).toString());
        responseDto.setObjectType(archivedLogEntity.getObjectType().toString());
        responseDto.setTimeCreated(archivedLogEntity.getTime_created().toString());

        return responseDto;
    }
}
