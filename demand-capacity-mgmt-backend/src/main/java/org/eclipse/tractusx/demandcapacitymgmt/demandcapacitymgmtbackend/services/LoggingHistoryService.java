package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.util.List;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LoggingHistoryEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.MaterialDemandStatus;
import org.springframework.http.ResponseEntity;

public interface LoggingHistoryService {
    List<LoggingHistoryResponse> getAllLoggingHistory();
    LoggingHistoryResponse createLog(LoggingHistoryRequest logEntity);

    // TODO: queries
    List<LoggingHistoryResponse> getLoggingHistoryByCapacity();
    List<LoggingHistoryResponse> getLoggingHistoryByMaterialDemand();
    List<LoggingHistoryResponse> filterByTime();

    // TODO: Work on the event type logic
    List<LoggingHistoryResponse> filterByEventType();
    // TODO: Work on the event status api
    List<LoggingHistoryResponse> filterByEventStatus();
    /* TODO: needs integration with vinicius branch
    List<LoggingHistoryResponse> getLogsFavoredByMe();
    List<LoggingHistoryResponse> getLogsManagedByMe();
    List<LoggingHistoryResponse> getAllEventsRelatedToMeOnly();
    */

}
