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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CompanyEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.FavoriteEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.FavoriteType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CompanyRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.FavoriteRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.MaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.FavoriteService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    private final CapacityGroupRepository capacityGroupRepository;
    private final MaterialDemandRepository materialDemandRepository;
    private final CompanyRepository companyRepository;

    @Override
    public FavoriteResponse getAllFavorites(String userID) {
        List<FavoriteEntity> favoriteEntities = favoriteRepository.findByUserID(UUID.fromString(userID));
        return filterFavorites(favoriteEntities);
    }

    @Override
    public FavoriteResponse getAllFavoritesByType(String userID, FavoriteType type) {
        List<FavoriteEntity> favoriteResponseList = favoriteRepository.findByUserIDAndType(UUID.fromString(userID),type);
        List<MaterialDemandFavoriteResponse> favoriteResponses = new ArrayList<>();
        for(FavoriteEntity fav : favoriteResponseList){
            favoriteResponses.add(convertToMaterialDemandResponse(fav));
        }
        FavoriteResponse response = new FavoriteResponse();
        response.setMaterialDemands(favoriteResponses);
        return response;
    }



    private FavoriteResponse filterFavorites(List<FavoriteEntity> favoriteEntities) {
        FavoriteResponse response = new FavoriteResponse();

        List<SingleCapacityGroupFavoriteResponse> capacityGroupList = new ArrayList<>();
        List<MaterialDemandFavoriteResponse> materialDemandList = new ArrayList<>();
        List<CompanyDtoFavoriteResponse> companyList = new ArrayList<>();

        for (FavoriteEntity entity : favoriteEntities) {
            switch (entity.getType()) {
                case CAPACITY_GROUP -> capacityGroupList.add(convertToSingleCapacityGroup(entity));
                case MATERIAL_DEMAND -> materialDemandList.add(convertToMaterialDemandResponse(entity));
                case COMPANY_BASE_DATA -> companyList.add(convertToCompanyDto(entity));
            }
        }

        // Set the filtered lists to the response
        response.setCapacityGroups(capacityGroupList);
        response.setMaterialDemands(materialDemandList);
        response.setCompanies(companyList);

        return response;
    }

    private SingleCapacityGroupFavoriteResponse convertToSingleCapacityGroup(FavoriteEntity entity) {
        Optional<CapacityGroupEntity> cgEntity = capacityGroupRepository.findById(entity.getFavoriteId());
        if (cgEntity.isPresent()) {
            CapacityGroupEntity capacityGroup = cgEntity.get();
            SingleCapacityGroupFavoriteResponse scgfv = new SingleCapacityGroupFavoriteResponse();
            scgfv.setId(capacityGroup.getId().toString());
            scgfv.setCapacityGroupId(capacityGroup.getId().toString());
            scgfv.setCapacityGroupName(capacityGroup.getCapacityGroupName());
            scgfv.setCustomer(capacityGroup.getCustomer().getBpn());
            scgfv.setSupplier(capacityGroup.getSupplier().getBpn());
            return scgfv;
        } else return null;
    }

    private MaterialDemandFavoriteResponse convertToMaterialDemandResponse(FavoriteEntity entity) {
        Optional<MaterialDemandEntity> materialDemandEntity = materialDemandRepository.findById(entity.getFavoriteId());
        if (materialDemandEntity.isPresent()) {
            MaterialDemandEntity materialDemand = materialDemandEntity.get();

            MaterialDemandFavoriteResponse response = new MaterialDemandFavoriteResponse();
            response.setId(materialDemand.getId().toString());
            response.setCustomer(materialDemand.getCustomerId().toString());
            response.setSupplier(materialDemand.getSupplierId().toString());
            response.setMaterialNumberCustomer(materialDemand.getMaterialNumberCustomer());
            response.setMaterialNumberSupplier(materialDemand.getMaterialNumberSupplier());
            response.setChangedAt(materialDemand.getChangedAt().toString());
            response.setUnitOfMeasure(materialDemand.getUnitMeasure().getCxSymbol());

            return response;
        } else return null;
    }

    private CompanyDtoFavoriteResponse convertToCompanyDto(FavoriteEntity entity) {
        Optional<CompanyEntity> cEntity = companyRepository.findById(entity.getFavoriteId());
        if (cEntity.isPresent()) {
            CompanyEntity companyEntity = cEntity.get();

            CompanyDtoFavoriteResponse companyFavoriteResponse = new CompanyDtoFavoriteResponse();
            companyFavoriteResponse.setId(companyEntity.getId().toString());
            companyFavoriteResponse.setBpn(companyEntity.getBpn());
            companyFavoriteResponse.setMyCompany(companyEntity.getMyCompany());
            companyFavoriteResponse.setCompanyName(companyEntity.getCompanyName());
            companyFavoriteResponse.setCountry(companyEntity.getCountry());
            companyFavoriteResponse.setZipCode(companyEntity.getZipCode());

            return companyFavoriteResponse;
        } else return null;
    }

    @Override
    public void createFavorite(FavoriteRequest favoriteRequest, String cookieUserID) {
        favoriteRepository.save(generateFavoriteEntity(favoriteRequest, cookieUserID));
    }

    @Override
    public void updateFavorite(Integer id, FavoriteRequest favoriteRequest, String userID) {
        FavoriteEntity entity = favoriteRepository.findByUserIDAndId(UUID.fromString(userID), id);
        if (entity != null) {
            entity.setFavoriteId(UUID.fromString(favoriteRequest.getFavoriteId()));
            entity.setType(FavoriteType.valueOf(favoriteRequest.getfType()));
            favoriteRepository.saveAndFlush(entity);
        } else throw new NotFoundException(
            404,
            "Favorite type not found",
            new ArrayList<>(List.of("provided UUID did not match any records. - " + id))
        );
    }

    @Override
    public void deleteFavorite(String userID, String favoriteID) {
        favoriteRepository.deleteFavorite(UUID.fromString(userID),UUID.fromString(favoriteID));
    }

    private FavoriteEntity generateFavoriteEntity(FavoriteRequest request, String cookieUserID) {
        return FavoriteEntity
            .builder()
            .userID(UUID.fromString(cookieUserID))
            .favoriteId(UUID.fromString(request.getFavoriteId()))
            .type(FavoriteType.valueOf(request.getfType()))
            .build();
    }
}
