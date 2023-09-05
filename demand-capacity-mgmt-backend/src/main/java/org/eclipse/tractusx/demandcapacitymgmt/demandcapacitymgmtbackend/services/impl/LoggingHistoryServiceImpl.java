package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryResponse;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LoggingHistoryRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.DemandService;
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

    //TODO : Adjust the posted id
    private LoggingHistoryEntity convertDtoToEntity(LoggingHistoryRequest loggingHistoryRequest) {
        CapacityGroupEntity capacityGroupEntity = capacityGroupService.getCapacityGroupEntityById(
            loggingHistoryRequest.getCapacityGroupId()
        );

        MaterialDemandEntity materialDemandEntity = demandService.getDemandEntityById(
            loggingHistoryRequest.getMaterialDemandId()
        );

        return LoggingHistoryEntity
            .builder()
            //                .id(UUID.randomUUID())
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
    public List<LoggingHistoryResponse> getLoggingHistoryByCapacity() {
        return null;
    }

    @Override
    public List<LoggingHistoryResponse> getLoggingHistoryByMaterialDemand() {
        return null;
    }

    @Override
    public List<LoggingHistoryResponse> filterByTime() {
        return null;
    }

    @Override
    public List<LoggingHistoryResponse> filterByEventType() {
        return null;
    }

    @Override
    public List<LoggingHistoryResponse> filterByEventStatus() {
        return null;
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
