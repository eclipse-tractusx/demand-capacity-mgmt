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

import eclipse.tractusx.demand_capacity_mgmt_specification.api.CapacityGroupApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupDefaultViewResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.MaterialDemandResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class CapacityGroupController implements CapacityGroupApi {

    private final CapacityGroupService capacityGroupService;

    @Override
    public ResponseEntity<List<CapacityGroupDefaultViewResponse>> getCapacityGroup() throws Exception {
        return null;
    }

    @Override
    public ResponseEntity<CapacityGroupResponse> postCapacityGroup(CapacityGroupRequest capacityGroupRequest)
        throws Exception {
        capacityGroupService.createCapacityGroup(capacityGroupRequest);

        return null;
    }
}
