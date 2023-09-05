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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.FavoriteRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.FavoriteResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.FavoriteEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.FavoriteType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.FavoriteRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.FavoriteService;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    @Override
    public List<FavoriteResponse> getAllFavorites() {
        List<FavoriteEntity> favoriteEntities = favoriteRepository.findAll();
        return favoriteEntities.stream().map(this::convertFavoriteResponse).toList();
    }

    @Override
    public List<FavoriteResponse> getAllFavoritesByType(FavoriteType type) {
        List<FavoriteEntity> favoriteEntities = favoriteRepository.findByType(type);
        return favoriteEntities.stream().map(this::convertFavoriteResponse).toList();
    }

    @Override
    public FavoriteResponse createFavorite(FavoriteRequest favoriteRequest) {
        return null;
    }

    @Override
    public FavoriteResponse updateFavorite(FavoriteRequest favoriteRequest) {
        return null;
    }

    @Override
    public void deleteFavorite(FavoriteRequest favoriteRequest) {

    }

    private FavoriteResponse convertFavoriteResponse(FavoriteEntity request){
        FavoriteResponse response = new FavoriteResponse();
        response.setFavoriteId(request.getId().toString());
        response.setfType(request.getType().name());
        return response;
    }
}
