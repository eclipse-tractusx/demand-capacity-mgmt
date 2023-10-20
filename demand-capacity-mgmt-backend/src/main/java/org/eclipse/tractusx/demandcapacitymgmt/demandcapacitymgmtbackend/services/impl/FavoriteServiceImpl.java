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
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.FavoriteRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.FavoriteService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    @Override
    public FavoriteResponse getAllFavorites() {
        List<FavoriteEntity> favoriteEntities = favoriteRepository.findAll();
        return null;
    }

    @Override
    public List<FavoriteResponse> getAllFavoritesByType(String type) {
        List<FavoriteEntity> favoriteEntities = favoriteRepository.findByType(FavoriteType.valueOf(type));
        return favoriteEntities.stream().map(this::convertFavoriteResponse).toList();
    }

    @Override
    public FavoriteResponse createFavorite(FavoriteRequest favoriteRequest, String cookieUserID) {
        FavoriteEntity entity = favoriteRepository.save(generateFavoriteEntity(favoriteRequest, cookieUserID));
        return convertFavoriteResponse(entity);
    }

    @Override
    public FavoriteResponse updateFavorite(
        UUID id,
        FavoriteType type,
        FavoriteRequest favoriteRequest,
        String cookieUserID
    ) {
        FavoriteEntity entity = favoriteRepository.findByFavoriteIdAndTypeAndId(
            id,
            type,
            UUID.fromString(cookieUserID)
        );

        if (entity != null) {
            entity.setFavoriteId(UUID.fromString(favoriteRequest.getFavoriteId()));
            entity.setType(FavoriteType.valueOf(favoriteRequest.getfType()));
            favoriteRepository.saveAndFlush(entity);
            return convertFavoriteResponse(entity);
        } else throw new NotFoundException(
            404,
            "Demand category not found",
            new ArrayList<>(List.of("provided UUID did not match any records. - " + id))
        );
    }

    @Override
    public void deleteFavorite(UUID id, String cookieUserID) {
        favoriteRepository.deleteByFavoriteIdAndId(id, UUID.fromString(cookieUserID));
    }

    private FavoriteResponse convertFavoriteResponse(FavoriteEntity request) {
        FavoriteResponse response = new FavoriteResponse();


        return response;
    }

    private FavoriteEntity generateFavoriteEntity(FavoriteRequest request, String cookieUserID) {
        return FavoriteEntity
            .builder()
            .id(UUID.fromString(cookieUserID))
            .favoriteId(UUID.fromString(request.getFavoriteId()))
            .favoriteTypeId(UUID.fromString(request.getfTypeId()))
            .type(FavoriteType.valueOf(request.getfType()))
            .build();
    }
}
