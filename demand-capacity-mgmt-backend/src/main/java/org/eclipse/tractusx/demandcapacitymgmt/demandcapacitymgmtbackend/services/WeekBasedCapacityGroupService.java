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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekBasedCapacityGroupRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekBasedCapacityGroupResponse;

import java.util.List;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekBasedMaterialDemandResponseDto;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.WeekBasedCapacityGroupEntity;
import org.springframework.http.ResponseEntity;

public interface WeekBasedCapacityGroupService {
    void createWeekBasedCapacityGroup(List<WeekBasedCapacityGroupRequest> weekBasedCapacityGroupRequest);

    void receiveWeekBasedCapacityGroup();

    void sendWeekBasedCapacityGroup();

    List<WeekBasedCapacityGroupResponse> getOldWeekBasedCapacityGroups();

    List<WeekBasedCapacityGroupResponse> getUpdatedWeekBasedCapacityGroups();

    void createWeekBasedCapacityGroupRequestFromEntity(CapacityGroupEntity capacityGroupEntity);

    ResponseEntity<WeekBasedCapacityGroupResponse> updateWeekBasedCapacityGroup(
        String id,
        WeekBasedCapacityGroupRequest weekBasedCapacityGroupRequest
    );

    WeekBasedCapacityGroupEntity findById(String capacityGroupId);
}
