package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LoggingHistoryEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.CompanyType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LoggingHistoryRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.MaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LoggingHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class LoggingHistoryServiceImpl implements LoggingHistoryService {

    private final LoggingHistoryRepository loggingHistoryRepository;

    @Override
    public List<LoggingHistoryResponse> getAllLoggingHistory() {
        List<LoggingHistoryEntity> loggingHistoryEntityList = loggingHistoryRepository.findAll();
        return loggingHistoryEntityList.stream().map(this::convertLoggingHistoryResponseDto).toList();
    }

    @Override
    public boolean postLog(LoggingHistoryEntity logEntity) {
        loggingHistoryRepository.save(logEntity);
        return true;
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
