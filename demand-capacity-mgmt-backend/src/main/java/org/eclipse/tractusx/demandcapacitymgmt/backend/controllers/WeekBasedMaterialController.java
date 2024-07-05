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

import eclipse.tractusx.demandcapacitymgm.specification.api.WeekBasedMaterialDemandApi;
import eclipse.tractusx.demandcapacitymgm.specification.model.WeekBasedMaterialDemandRequestDto;
import eclipse.tractusx.demandcapacitymgm.specification.model.WeekBasedMaterialDemandResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.WeekBasedMaterialService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class WeekBasedMaterialController implements WeekBasedMaterialDemandApi {

    private final WeekBasedMaterialService weekBasedMaterialService;
    private HttpServletRequest request;

    @Override
    public ResponseEntity<List<WeekBasedMaterialDemandResponseDto>> getWeekBasedMaterialDemand() {
		List<WeekBasedMaterialDemandResponseDto> capacityGroupDefaultViewResponseList =
			weekBasedMaterialService.getWeekBasedMaterialDemands();
        return ResponseEntity.status(HttpStatus.OK).body(capacityGroupDefaultViewResponseList);
    }

    @Override
    public ResponseEntity<Void> postWeekBasedMaterialDemand(
        List<WeekBasedMaterialDemandRequestDto> weekBasedMaterialDemandRequestDto
    ) {
        String userID = UserUtil.getUserID(request);
        weekBasedMaterialService.createWeekBasedMaterial(weekBasedMaterialDemandRequestDto, userID);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<WeekBasedMaterialDemandResponseDto> updateWeekBasedMaterialDemandById(
        String demandId,
        WeekBasedMaterialDemandRequestDto weekBasedMaterialDemandRequestDto
    ) {
        String userID = UserUtil.getUserID(request);
        WeekBasedMaterialDemandResponseDto responseDto = weekBasedMaterialService.updateWeekBasedMaterial(
            demandId,
            weekBasedMaterialDemandRequestDto,
            userID
        );
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}
