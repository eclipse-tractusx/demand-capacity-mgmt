/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * *******************************************************************************
 */
package org.eclipse.tractusx.demandcapacitymgmt.backend.controllers;

import eclipse.tractusx.demandcapacitymgmt.specification.api.AlertsApi;
import eclipse.tractusx.demandcapacitymgmt.specification.model.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.AlertService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
//@RequestMapping("/alerts")
public class AlertController implements AlertsApi {

    private HttpServletRequest request;
    private final AlertService alertService;

    @Override
    public ResponseEntity<AlertResponse> configureAlert(AlertRequest alertRequest) throws Exception {
        String userID = UserUtil.getUserID(request);
        alertRequest.setUser(userID);
        AlertResponse responseDto = alertService.configureAlert(alertRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @Override
    public ResponseEntity<TriggeredAlertResponse> configureTriggeredAlert(TriggeredAlertRequest triggeredAlertRequest)
        throws Exception {
        TriggeredAlertResponse responseDto = alertService.postTriggeredAlerts(triggeredAlertRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @Override
    public ResponseEntity<List<AlertResponse>> getAlerts() throws Exception {
        String userID = UserUtil.getUserID(request);
        return ResponseEntity.status(HttpStatus.OK).body(alertService.getAlerts(userID));
    }

    @Override
    public ResponseEntity<List<TriggeredAlertResponse>> getTriggeredAlerts() throws Exception {
        String userID = UserUtil.getUserID(request);
        return ResponseEntity.status(HttpStatus.OK).body(alertService.getTriggeredAlerts(userID)); //
    }
}
