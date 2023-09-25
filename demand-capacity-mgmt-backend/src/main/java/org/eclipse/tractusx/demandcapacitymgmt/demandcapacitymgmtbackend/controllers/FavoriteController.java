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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.FavoriteApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.FavoriteRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.FavoriteResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.FavoriteType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class FavoriteController implements FavoriteApi {

    private final FavoriteService favoriteService;

    @Override
    public ResponseEntity<FavoriteResponse> createFavorite(FavoriteRequest favoriteRequest) throws Exception {
        FavoriteResponse response = favoriteService.createFavorite(favoriteRequest);
        return ResponseEntity.status(200).body(response);
    }

    @Override
    public ResponseEntity<Void> deleteFavoriteById(String id) throws Exception {
        favoriteService.deleteFavorite(UUID.fromString(id));
        return ResponseEntity.status(200).build();
    }

    @Override
    public ResponseEntity<List<FavoriteResponse>> getFavorite() throws Exception {
        List<FavoriteResponse> responseList = favoriteService.getAllFavorites();
        return ResponseEntity.status(200).body(responseList);
    }

    @Override
    public ResponseEntity<List<FavoriteResponse>> getFavoriteByType(String type) throws Exception {
        List<FavoriteResponse> responseList = favoriteService.getAllFavoritesByType(type);
        return ResponseEntity.status(200).body(responseList);
    }

    @Override
    public ResponseEntity<FavoriteResponse> updateFavorite(String id, String type, FavoriteRequest favoriteRequest)
        throws Exception {
        FavoriteResponse response = favoriteService.updateFavorite(
            UUID.fromString(id),
            FavoriteType.valueOf(type),
            favoriteRequest
        );
        return ResponseEntity.status(200).body(response);
    }
}
