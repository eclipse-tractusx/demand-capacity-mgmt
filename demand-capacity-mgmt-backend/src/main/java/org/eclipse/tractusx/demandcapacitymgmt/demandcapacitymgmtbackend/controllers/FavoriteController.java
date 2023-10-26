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
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.FavoriteType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.FavoriteService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class FavoriteController implements FavoriteApi {

    private final FavoriteService favoriteService;

    private HttpServletRequest request;

    @Override
    public ResponseEntity<Void> createFavorite(FavoriteRequest favoriteRequest) {
        favoriteService.createFavorite(favoriteRequest, UserUtil.getUserID(request));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Override
    public ResponseEntity<Void> deleteFavoriteById(String id) {
        favoriteService.deleteFavorite(UserUtil.getUserID(request), id);
        return ResponseEntity.status(204).build();
    }

    @Override
    public ResponseEntity<FavoriteResponse> getFavorite() throws Exception {
        FavoriteResponse responseList = favoriteService.getAllFavorites(UserUtil.getUserID(request));
        return ResponseEntity.status(200).body(responseList);
    }

    @Override
    public ResponseEntity<FavoriteResponse> getFavoriteByType(String type) {
        FavoriteResponse responseList = favoriteService.getAllFavoritesByType(
                UserUtil.getUserID(request),
                FavoriteType.valueOf(type)
        );
        return ResponseEntity.status(200).body(responseList);
    }
}
