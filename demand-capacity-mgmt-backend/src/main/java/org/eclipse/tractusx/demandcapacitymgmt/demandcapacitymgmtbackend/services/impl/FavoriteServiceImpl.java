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
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.FavoriteEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.FavoriteType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.FavoriteRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.FavoriteService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    //TODO IMPLEMENT USER_ID IN OPERATIONS

    @Override
    public List<FavoriteResponse> getAllFavorites() {
        List<FavoriteEntity> favoriteEntities = favoriteRepository.findAll();
        return favoriteEntities.stream().map(this::convertFavoriteResponse).toList();
    }

    @Override
    public List<FavoriteResponse> getAllFavoritesByType(String type) {
        List<FavoriteEntity> favoriteEntities = favoriteRepository.findByType(FavoriteType.valueOf(type));
        return favoriteEntities.stream().map(this::convertFavoriteResponse).toList();
    }

    @Override
    public FavoriteResponse createFavorite(FavoriteRequest favoriteRequest) {
        FavoriteEntity entity = favoriteRepository.save(generateFavoriteEntity(favoriteRequest));
        return convertFavoriteResponse(entity);
    }

    @Override
    public FavoriteResponse updateFavorite(UUID id, FavoriteType type, FavoriteRequest favoriteRequest) {
        FavoriteEntity entity = favoriteRepository.findByFavoriteIdAndTypeAndId(
            id,
            type,
            UUID.fromString("8842f835-38e9-42b1-8c07-fb310b90ef3a")
        ); //TODO FETCH USER ID TO UPDATE OPERATION

        if (entity != null) {
            entity.setFavoriteId(UUID.fromString(favoriteRequest.getFavoriteId()));
            entity.setType(FavoriteType.valueOf(favoriteRequest.getfType()));
            favoriteRepository.saveAndFlush(entity);
            return convertFavoriteResponse(entity);
        } else throw new NotFoundException("Entity to update was not found in DB." + "\n" + "Did you meant to create?");
    }

    @Override
    public void deleteFavorite(UUID id) {
        //TODO PLACE USER ID IN HERE
        favoriteRepository.deleteByFavoriteIdAndId(id, UUID.fromString("8842f835-38e9-42b1-8c07-fb310b90ef3a"));
    }

    private FavoriteResponse convertFavoriteResponse(FavoriteEntity request) {
        FavoriteResponse response = new FavoriteResponse();
        response.setFavoriteId(request.getId().toString());
        response.setfType(request.getType().name());
        response.setfTypeId(request.getFavoriteTypeId().toString());
        return response;
    }

    private FavoriteEntity generateFavoriteEntity(FavoriteRequest request) {
        return FavoriteEntity
            .builder()
            .id(UUID.randomUUID()) //TODO USER ID HERE
            .favoriteId(UUID.fromString(request.getFavoriteId()))
             .favoriteTypeId(UUID.fromString(request.getfTypeId()))
             .type(FavoriteType.valueOf(request.getfType()))
            .build();
    }
}
