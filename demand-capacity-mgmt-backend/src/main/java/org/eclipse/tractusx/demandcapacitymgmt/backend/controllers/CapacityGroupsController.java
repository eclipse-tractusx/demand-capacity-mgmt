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

import eclipse.tractusx.demandcapacitymgmt.specification.api.CapacityGroupApi;
import eclipse.tractusx.demandcapacitymgmt.specification.model.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.CapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class CapacityGroupsController implements CapacityGroupApi {

    private CapacityGroupService service;
    private HttpServletRequest request;

    @Override
    public ResponseEntity<List<CapacityGroupDefaultViewResponse>> getCapacityGroups() {
        String userID = UserUtil.getUserID(request);
        Role userRole = UserUtil.getUserRole(request);
        List<CapacityGroupDefaultViewResponse> capacityGroupDefaultViewResponses = service.getAll(userID, userRole);
        return ResponseEntity.status(HttpStatus.OK).body(capacityGroupDefaultViewResponses);
    }

    @Override
    public ResponseEntity<SingleCapacityGroup> getCapacityGroupById(String capacityGroupId) {
        SingleCapacityGroup capacityGroupResponse = service.getCapacityGroupById(capacityGroupId);
        return ResponseEntity.status(HttpStatus.OK).body(capacityGroupResponse);
    }

    @Override
    public ResponseEntity<CapacityGroupResponse> postCapacityGroup(CapacityGroupRequest capacityGroupRequest) {
        String userID = UserUtil.getUserID(request);
        CapacityGroupResponse capacityGroupResponse = service.createCapacityGroup(capacityGroupRequest, userID);
        return ResponseEntity.status(HttpStatus.OK).body(capacityGroupResponse);
    }

    @Override
    public ResponseEntity<Void> postLinkedCapacityGroupDemand(LinkCGDSRequest linkCGDSRequest) throws Exception {
        String userID = UserUtil.getUserID(request);
        service.linkCapacityGroupToMaterialDemand(linkCGDSRequest, userID);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
