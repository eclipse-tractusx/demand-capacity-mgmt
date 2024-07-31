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

import eclipse.tractusx.demandcapacitymgm.specification.api.UnitMeasureApi;
import eclipse.tractusx.demandcapacitymgm.specification.model.UnitMeasure;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgm.backend.services.UnityOfMeasureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
public class UnitMeasureController implements UnitMeasureApi {

    private final UnityOfMeasureService unityOfMeasureService;

    @Override
    public ResponseEntity<List<UnitMeasure>> getUnitMeasure() throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(unityOfMeasureService.getAllUnitMeasure());
    }

    @Override
    public ResponseEntity<UnitMeasure> getUnitMeasureByID(String id) throws Exception {
        return ResponseEntity.status(200).body(unityOfMeasureService.findById(UUID.fromString(id)));
    }
}
