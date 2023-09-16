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
    public ResponseEntity<LoggingHistoryResponse> postLogs(LoggingHistoryRequest loggingHistoryRequest) {
        LoggingHistoryResponse responseDto = loggingHistoryService.createLog(loggingHistoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
