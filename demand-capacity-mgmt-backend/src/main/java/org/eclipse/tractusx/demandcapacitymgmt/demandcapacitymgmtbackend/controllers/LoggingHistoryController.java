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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.LoggingHistoryApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.ArchivedLoggingHistoryResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LoggingHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class LoggingHistoryController implements LoggingHistoryApi {

    private final LoggingHistoryService loggingHistoryService;

    @Override
    public ResponseEntity<Void> createArchivedLog(LoggingHistoryRequest loggingHistoryRequest) {
        loggingHistoryService.archiveLog(loggingHistoryRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<Void> deleteAllArchivedLogs() {
        loggingHistoryService.deleteAllArchivedLogs();
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<Void> deleteAllLogs() {
        loggingHistoryService.deleteAllLogs();
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<Void> deleteArchivedLogById(String logId) throws Exception {
        loggingHistoryService.deleteArchivedLogById(logId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<Void> deleteLogById(String logId) throws Exception {
        loggingHistoryService.deleteLogById(logId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<List<ArchivedLoggingHistoryResponse>> getArchivedLogs() throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(loggingHistoryService.getAllArchivedLogs());
    }

    @Override
    public ResponseEntity<List<LoggingHistoryResponse>> filterLogs(
        String startTime,
        String endTime,
        String event,
        String materialDemandId,
        String capacityGroupId
    ) throws Exception {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(loggingHistoryService.filterLog(capacityGroupId, materialDemandId, event, startTime, endTime));
    }

    @Override
    public ResponseEntity<List<LoggingHistoryResponse>> getLoggingHistory() {
        return ResponseEntity.status(HttpStatus.OK).body(loggingHistoryService.getAllLoggingHistory());
    }

    @Override
    public ResponseEntity<List<LoggingHistoryResponse>> getLoggingHistoryForFavoriteCapacityGroups() {
        return ResponseEntity.status(HttpStatus.OK).body(loggingHistoryService.filterByFavoriteCapacityGroup());
    }

    @Override
    public ResponseEntity<List<LoggingHistoryResponse>> getLoggingHistoryForFavoriteMaterialDemands() {
        return ResponseEntity.status(HttpStatus.OK).body(loggingHistoryService.filterByFavoriteMaterialDemand());
    }

    @Override
    public ResponseEntity<LoggingHistoryResponse> postLogs(LoggingHistoryRequest loggingHistoryRequest) {
        LoggingHistoryResponse responseDto = loggingHistoryService.createLog(loggingHistoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
