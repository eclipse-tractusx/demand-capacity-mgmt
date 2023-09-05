package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.LoggingHistoryApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CompanyDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.MaterialDemandResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.DemandService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LoggingHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class LoggingHistoryController implements LoggingHistoryApi {

    private final LoggingHistoryService loggingHistoryService;

    @Override
    public ResponseEntity<List<LoggingHistoryResponse>> getLoggingHistory() {
        return ResponseEntity.status(HttpStatus.OK).body(loggingHistoryService.getAllLoggingHistory());
    }

    @Override
    public ResponseEntity<LoggingHistoryResponse> postLogs(LoggingHistoryRequest loggingHistoryRequest)
         {
                LoggingHistoryResponse responseDto =  loggingHistoryService.createLog(loggingHistoryRequest);
                return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
