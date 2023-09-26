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

import eclipse.tractusx.demand_capacity_mgmt_specification.api.DemandApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.MaterialDemandRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.MaterialDemandResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.DemandService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class DemandController implements DemandApi {

    private final DemandService demandService;

    @Override
    public ResponseEntity<Void> deleteDemandsById(String demandId) {
        demandService.deleteDemandById(demandId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<MaterialDemandResponse> getDemandsById(String demandId) {
        MaterialDemandResponse responseDto = demandService.getDemandById(demandId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @Override
    public ResponseEntity<List<MaterialDemandResponse>> getDemandsByProjectID() {
        List<MaterialDemandResponse> demandResponseDtos = demandService.getAllDemandsByProjectId();
        return ResponseEntity.status(HttpStatus.OK).body(demandResponseDtos);
    }

    @Override
    public ResponseEntity<MaterialDemandResponse> postDemand(MaterialDemandRequest materialDemandRequest) {
        MaterialDemandResponse responseDto = demandService.createDemand(materialDemandRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @Override
    public ResponseEntity<MaterialDemandResponse> updateDemandsById(
        String demandId,
        MaterialDemandRequest materialDemandRequest
    ) {
        MaterialDemandResponse responseDto = demandService.updateDemand(demandId, materialDemandRequest);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}
