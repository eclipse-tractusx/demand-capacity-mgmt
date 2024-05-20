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

package org.eclipse.tractusx.demandcapacitymgmt.backend.controllers;

import eclipse.tractusx.demandcapacitymgmt.specification.api.StatusesApi;
import eclipse.tractusx.demandcapacitymgmt.specification.model.StatusRequest;
import eclipse.tractusx.demandcapacitymgmt.specification.model.StatusesResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.StatusesService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class StatusesController implements StatusesApi {

    private final StatusesService statusesService;

    private HttpServletRequest request;

    @Override
    public ResponseEntity<StatusesResponse> getStatuses() {
        String userID = UserUtil.getUserID(request);
        return ResponseEntity.status(HttpStatus.OK).body(statusesService.getAllStatuses(userID));
    }

    @Override
    public ResponseEntity<StatusesResponse> postStatus(StatusRequest statusRequest) {
        String userID = UserUtil.getUserID(request);
        StatusesResponse responseDto = statusesService.postStatuses(statusRequest, userID);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @Override
    public ResponseEntity<StatusesResponse> updateStatusesById(String statusId, StatusRequest statusRequest) {
        String userID = UserUtil.getUserID(request);
        statusesService.updateStatus(statusRequest, userID);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
