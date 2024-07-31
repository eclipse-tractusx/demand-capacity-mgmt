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

package org.eclipse.tractusx.demandcapacitymgm.backend.controllers;

import eclipse.tractusx.demandcapacitymgm.specification.api.DemandApi;
import eclipse.tractusx.demandcapacitymgm.specification.model.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgm.backend.services.DemandService;
import org.eclipse.tractusx.demandcapacitymgm.backend.utils.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class DemandController implements DemandApi {

    private final DemandService demandService;

    private HttpServletRequest request;

    @Override
    public ResponseEntity<Void> deleteDemandsById(String demandId) {
        String userID = UserUtil.getUserID(request);
        demandService.deleteDemandById(demandId, userID);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<List<MaterialDemandSeriesResponse>> getDemandSeries() throws Exception {
        //TODO REMOVE.
        return null;
    }

    @Override
    public ResponseEntity<List<MaterialDemandSeriesResponse>> getDemandSeriesByMaterialDemand(String materialDemandId)
        throws Exception {
        //TODO REMOVE.
        return null;
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
    public ResponseEntity<DemandSeriesCompositeResponse> getLinkedDemandSeriesByCompositeKeyID(
        DemandSeriesCompositeRequest demandSeriesCompositeRequest
    ) throws Exception {
        DemandSeriesCompositeResponse response = demandService.getAllDemandsByCompositeKey(
            demandSeriesCompositeRequest
        );
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public ResponseEntity<Void> unlinkedDemandSeriesComposites(DemandSeriesUnlinkRequest demandSeriesUnlinkRequest)
        throws Exception {
        String userID = UserUtil.getUserID(request);
        demandService.unlinkComposites(demandSeriesUnlinkRequest, userID);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Override
    public ResponseEntity<MaterialDemandResponse> postDemand(MaterialDemandRequest materialDemandRequest) {
        String userID = UserUtil.getUserID(request);
        MaterialDemandResponse responseDto = demandService.createDemand(materialDemandRequest, userID);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @Override
    public ResponseEntity<MaterialDemandResponse> updateDemandsById(
        String demandId,
        MaterialDemandRequest materialDemandRequest
    ) {
        String userID = UserUtil.getUserID(request);
        MaterialDemandResponse responseDto = demandService.updateDemand(demandId, materialDemandRequest, userID);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}
