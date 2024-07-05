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

import eclipse.tractusx.demandcapacitymgm.specification.api.WeekBasedCapacityGroupApi;
import eclipse.tractusx.demandcapacitymgm.specification.model.WeekBasedCapacityGroupDtoRequest;
import eclipse.tractusx.demandcapacitymgm.specification.model.WeekBasedCapacityGroupDtoResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.WeekBasedCapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class WeekBasedCapacityGroupController implements WeekBasedCapacityGroupApi {

    private final WeekBasedCapacityGroupService weekBasedCapacityGroupService;
    private HttpServletRequest request;

    @Override
    public ResponseEntity<List<WeekBasedCapacityGroupDtoResponse>> getWeekBasedCapacityGroup() {
		List<WeekBasedCapacityGroupDtoResponse> capacityGroupDefaultViewResponseList =
			weekBasedCapacityGroupService.getWeekBasedCapacityGroups();
        return ResponseEntity.status(HttpStatus.OK).body(capacityGroupDefaultViewResponseList);
    }

    @Override
    public ResponseEntity<Void> postWeekBasedCapacityGroup(
        List<WeekBasedCapacityGroupDtoRequest> weekBasedCapacityGroupRequest
    ) {
        String userID = UserUtil.getUserID(request);
        weekBasedCapacityGroupService.createWeekBasedCapacityGroup(weekBasedCapacityGroupRequest, userID);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<WeekBasedCapacityGroupDtoResponse> updateWeekBasedCapacityGroupById(
        String weekBasedCapacityId,
        WeekBasedCapacityGroupDtoRequest weekBasedCapacityGroupRequest
    ) {
        String userID = UserUtil.getUserID(request);
        WeekBasedCapacityGroupDtoResponse responseDto = weekBasedCapacityGroupService.updateWeekBasedCapacityGroup(
            weekBasedCapacityId,
            weekBasedCapacityGroupRequest,
            userID
        );
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}
