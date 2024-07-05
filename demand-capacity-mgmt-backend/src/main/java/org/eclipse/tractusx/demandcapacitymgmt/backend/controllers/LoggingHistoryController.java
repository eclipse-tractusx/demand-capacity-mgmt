/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023, 2024 Contributors to the Eclipse Foundation
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

package org.eclipse.tractusx.demandcapacitymgmt.backend.controllers;

import eclipse.tractusx.demandcapacitymgm.specification.api.LoggingHistoryApi;
import eclipse.tractusx.demandcapacitymgm.specification.model.ArchivedLoggingHistoryResponse;
import eclipse.tractusx.demandcapacitymgm.specification.model.LoggingHistoryRequest;
import eclipse.tractusx.demandcapacitymgm.specification.model.LoggingHistoryResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.LoggingHistoryService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class LoggingHistoryController implements LoggingHistoryApi {

    private final LoggingHistoryService loggingHistoryService;

    private HttpServletRequest request;

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
		return ResponseEntity.status(HttpStatus.OK).body(
			loggingHistoryService.filterLog(capacityGroupId, materialDemandId, event, startTime, endTime)
		);
    }

    @Override
    public ResponseEntity<List<LoggingHistoryResponse>> getLoggingHistory() {
        return ResponseEntity.status(HttpStatus.OK).body(loggingHistoryService.getAllLoggingHistory());
    }

    @Override
    public ResponseEntity<List<LoggingHistoryResponse>> getLoggingHistoryForFavoriteCapacityGroups() {
        String userID = UserUtil.getUserID(request);
        return ResponseEntity.status(HttpStatus.OK).body(loggingHistoryService.filterByFavoriteCapacityGroup(userID));
    }

    @Override
    public ResponseEntity<List<LoggingHistoryResponse>> getLoggingHistoryForFavoriteMaterialDemands() {
        String userID = UserUtil.getUserID(request);
        return ResponseEntity.status(HttpStatus.OK).body(loggingHistoryService.filterByFavoriteMaterialDemand(userID));
    }

    @Override
    public ResponseEntity<LoggingHistoryResponse> postLogs(LoggingHistoryRequest loggingHistoryRequest) {
        LoggingHistoryResponse responseDto = loggingHistoryService.createLog(loggingHistoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
