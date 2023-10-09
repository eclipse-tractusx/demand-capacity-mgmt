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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.FavoriteType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CompanyService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.FavoriteService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LoggingHistoryService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class CapacityGroupServiceImpl implements CapacityGroupService {

    private final MaterialDemandRepository materialDemandRepository;

    private final CompanyRepository companyRepository;
    private final CompanyService companyService;
    private final LinkedCapacityGroupMaterialDemandRepository linkedCapacityGroupMaterialDemandRepository;
    private final CapacityGroupRepository capacityGroupRepository;

    private final DemandSeriesRepository demandSeriesRepository;
    private UnitMeasure unitMeasure;

    private final LoggingHistoryService loggingHistoryService;

    private final FavoriteService favoriteService;

    @Override
    public CapacityGroupResponse createCapacityGroup(CapacityGroupRequest capacityGroupRequest) {
        CapacityGroupEntity capacityGroupEntity = enrichCapacityGroup(capacityGroupRequest);
        capacityGroupEntity = capacityGroupRepository.save(capacityGroupEntity);
        postLogs(capacityGroupEntity.getId().toString());
        for (UUID uuid : capacityGroupRequest.getLinkDemandSeriesID()) {
            LinkedCapacityGroupMaterialDemandEntity entity = new LinkedCapacityGroupMaterialDemandEntity();
            entity.setCapacityGroupID(capacityGroupEntity.getId());
            entity.setMaterialDemandID(uuid);
            linkedCapacityGroupMaterialDemandRepository.save(entity);
        }
        return convertCapacityGroupDto(capacityGroupEntity);
    }

    private void postLogs(String capacityGroupId) {
        AtomicBoolean isFavorited = new AtomicBoolean(false);
        favoriteService
            .getAllFavoritesByType(FavoriteType.CAPACITY_GROUP.toString())
            .forEach(
                favoriteResponse -> {
                    if (favoriteResponse.getfTypeId().equals(capacityGroupId)) {
                        isFavorited.set(true);
                    }
                }
            );
        LoggingHistoryRequest loggingHistoryRequest = new LoggingHistoryRequest();
        loggingHistoryRequest.setObjectType(EventObjectType.CAPACITY_GROUP.name());
        loggingHistoryRequest.setMaterialDemandId("");
        loggingHistoryRequest.setCapacityGroupId(capacityGroupId);
        loggingHistoryRequest.setEventDescription("Capacity Group Created");
        loggingHistoryRequest.setIsFavorited(isFavorited.get());
        loggingHistoryRequest.setEventType(EventType.GENERAL_EVENT.toString());
        loggingHistoryService.createLog(loggingHistoryRequest);
    }

    @Override
    public void linkCapacityGroupToMaterialDemand(LinkCGDSRequest linkCGDSRequest) {
        Optional<CapacityGroupEntity> optionalCapacityGroupEntity = capacityGroupRepository.findById(
            UUID.fromString(linkCGDSRequest.getCapacityGroupID())
        );

        List<MaterialDemandEntity> materialDemandEntities = new ArrayList<>();

        for (UUID uuid : linkCGDSRequest.getLinkedMaterialDemandID()) {
            Optional<MaterialDemandEntity> materialDemandEntity = materialDemandRepository.findById(uuid);
            if (materialDemandEntity.isPresent()) {
                MaterialDemandEntity materialDemand = materialDemandEntity.get();
                materialDemandEntities.add(materialDemand);
            }
        }

        for (MaterialDemandEntity matEntity : materialDemandEntities) {
            LinkedCapacityGroupMaterialDemandEntity entity = new LinkedCapacityGroupMaterialDemandEntity();
            if (optionalCapacityGroupEntity.isPresent()) {
                CapacityGroupEntity capacityGroupEntity = optionalCapacityGroupEntity.get();
                entity.setCapacityGroupID(capacityGroupEntity.getId());
                entity.setMaterialDemandID(matEntity.getId());
                entity.setCustomerID(matEntity.getCustomerId().getId());
                entity.setMaterialNumberCustomer(matEntity.getMaterialNumberCustomer());
                entity.setMaterialNumberSupplier(matEntity.getMaterialNumberSupplier());

                List<DemandSeries> demandSeriesList = matEntity.getDemandSeries();

                List<DemandSeries> matchedDemandSeriesList = demandSeriesList
                    .stream()
                    .filter(d -> matEntity.getId().equals(d.getMaterialDemand().getId()))
                    .toList();

                for (DemandSeries matchedDemandSeries : matchedDemandSeriesList) {
                    UUID demandCategoryId = matchedDemandSeries.getDemandCategory().getId();
                    entity.setDemandCategoryCodeID(demandCategoryId);
                    matchedDemandSeries.setCapacityGroupId(capacityGroupEntity.getId().toString());
                    demandSeriesRepository.save(matchedDemandSeries);
                }

                linkedCapacityGroupMaterialDemandRepository.save(entity);
            }
        }
    }

    private CapacityGroupEntity enrichCapacityGroup(CapacityGroupRequest request) {
        CompanyEntity customer = companyService.getCompanyById(UUID.fromString(request.getCustomer()));
        CompanyEntity supplier = companyService.getCompanyById(UUID.fromString(request.getSupplier()));

        CapacityGroupEntity capacityGroupEntity = new CapacityGroupEntity();
        capacityGroupEntity.setCapacityGroupName(request.getCapacitygroupname());
        capacityGroupEntity.setDefaultActualCapacity(request.getDefaultActualCapacity());
        capacityGroupEntity.setDefaultMaximumCapacity(request.getDefaultMaximumCapacity());
        capacityGroupEntity.setStartDate(LocalDate.parse(request.getStartDate()));
        capacityGroupEntity.setEndDate(LocalDate.parse(request.getEndDate()));
        capacityGroupEntity.setCustomer(customer);
        capacityGroupEntity.setSupplier(supplier);
        return capacityGroupEntity;
    }

    @Override
    public CapacityGroupResponse getCapacityGroupById(String capacityGroupId) {
        CapacityGroupEntity capacityGroupEntity = getCapacityGroupEntity(capacityGroupId);
        return convertCapacityGroupDto(capacityGroupEntity);
    }

    @Override
    public List<CapacityGroupDefaultViewResponse> getAll() {
        List<CapacityGroupEntity> capacityGroupEntityList = capacityGroupRepository.findAll();
        return convertCapacityGroupEntity(capacityGroupEntityList);
    }

    private CapacityGroupEntity getCapacityGroupEntity(String capacityGroupId) {
        UUIDUtil.checkValidUUID(capacityGroupId);
        UUID uuid = UUIDUtil.generateUUIDFromString(capacityGroupId);
        Optional<CapacityGroupEntity> capacityGroup = capacityGroupRepository.findById(uuid);

        if (capacityGroup.isEmpty()) {
            throw new NotFoundException(
                404,
                "The capacity group provided was not found",
                new ArrayList<>(List.of("UUID provided : " + uuid))
            );
        }

        return capacityGroup.get();
    }

    private CapacityGroupResponse convertCapacityGroupDto(CapacityGroupEntity capacityGroupEntity) {
        final CapacityGroupResponse responseDto = new CapacityGroupResponse();

        final CompanyDto customer = Optional
            .ofNullable(capacityGroupEntity.getCustomer())
            .map(companyService::convertEntityToDto)
            .orElse(null);

        final CompanyDto supplier = Optional
            .ofNullable(capacityGroupEntity.getSupplier())
            .map(companyService::convertEntityToDto)
            .orElse(null);

        responseDto.setCapacityGroupId(
            Optional.ofNullable(capacityGroupEntity.getId()).map(UUID::toString).orElse(null)
        );
        responseDto.setCapacitygroupname(capacityGroupEntity.getCapacityGroupName());
        responseDto.setDefaultActualCapacity(capacityGroupEntity.getDefaultActualCapacity());
        responseDto.setDefaultMaximumCapacity(capacityGroupEntity.getDefaultMaximumCapacity());
        responseDto.setStartDate(
            Optional.ofNullable(capacityGroupEntity.getStartDate()).map(Object::toString).orElse(null)
        );
        responseDto.setEndDate(
            Optional.ofNullable(capacityGroupEntity.getEndDate()).map(Object::toString).orElse(null)
        );
        responseDto.setCustomer(customer);
        responseDto.setSupplier(supplier);
        List<LinkedCapacityGroupMaterialDemandEntity> linkedCGMD = linkedCapacityGroupMaterialDemandRepository.findLinkedCapacityGroupMaterialDemandEntitiesByCapacityGroupID(
            capacityGroupEntity.getId()
        );
        List<UUID> linkedDemands = new ArrayList<>();
        for (LinkedCapacityGroupMaterialDemandEntity ent : linkedCGMD) {
            linkedDemands.add(ent.getMaterialDemandID());
        }
        responseDto.setLinkMaterialDemandIds(linkedDemands);
        return responseDto;
    }

    private UnitMeasure enrichUnitMeasure(UnitMeasureEntity unitMeasureEntity) {
        UnitMeasure unitMeasure = new UnitMeasure();

        unitMeasure.setId(unitMeasureEntity.getId().toString());
        unitMeasure.setUnCode(unitMeasureEntity.getUnCode());
        unitMeasure.setCxSymbol(unitMeasureEntity.getCxSymbol());

        return unitMeasure;
    }

    private CapacityRequest convertCapacityTimeSeries(CapacityTimeSeries capacityTimeSeries) {
        CapacityRequest capacityRequest = new CapacityRequest();

        capacityRequest.setActualCapacity(BigDecimal.valueOf(capacityTimeSeries.getActualCapacity()));
        capacityRequest.setMaximumCapacity(BigDecimal.valueOf(capacityTimeSeries.getMaximumCapacity()));
        capacityRequest.setCalendarWeek(capacityTimeSeries.getCalendarWeek().toString());

        return capacityRequest;
    }

    private LinkedDemandSeriesResponse convertLinkedDemandSeries(LinkedDemandSeries linkedDemandSeries) {
        LinkedDemandSeriesResponse linkedDemandSeriesResponse = new LinkedDemandSeriesResponse();

        linkedDemandSeriesResponse.setMaterialNumberCustomer(linkedDemandSeries.getMaterialNumberCustomer());
        linkedDemandSeriesResponse.setMaterialNumberSupplier(linkedDemandSeries.getMaterialNumberSupplier());

        CompanyDto customer = companyService.convertEntityToDto(linkedDemandSeries.getCustomerId());
        linkedDemandSeriesResponse.setCustomerLocation(customer);

        DemandCategoryResponse demand = convertDemandCategoryEntity(linkedDemandSeries.getDemandCategory());
        linkedDemandSeriesResponse.setDemandCategory(demand);

        return linkedDemandSeriesResponse;
    }

    private DemandCategoryResponse convertDemandCategoryEntity(DemandCategoryEntity demandCategoryEntity) {
        DemandCategoryResponse response = new DemandCategoryResponse();

        response.setId(demandCategoryEntity.getId().toString());
        response.setDemandCategoryCode(demandCategoryEntity.getDemandCategoryCode());
        response.setDemandCategoryName(demandCategoryEntity.getDemandCategoryName());

        return response;
    }

    private CompanyDto convertString(String supplier) {
        CompanyEntity entity = companyService.getCompanyById(UUID.fromString(supplier));

        return companyService.convertEntityToDto(entity);
    }

    private List<CapacityGroupDefaultViewResponse> convertCapacityGroupEntity(
        List<CapacityGroupEntity> capacityGroupEntityList
    ) {
        List<CapacityGroupDefaultViewResponse> capacityGroupList = new ArrayList<>();

        for (CapacityGroupEntity entity : capacityGroupEntityList) {
            CapacityGroupDefaultViewResponse response = new CapacityGroupDefaultViewResponse();

            response.setName(entity.getCapacityGroupName());
            response.setSupplierBNPL(entity.getSupplier().getBpn());
            response.setCustomerName(entity.getCustomer().getCompanyName());
            response.setCustomerBPNL(entity.getCustomer().getBpn());
            response.setInternalId(entity.getId().toString());
            response.setNumberOfMaterials(
                linkedCapacityGroupMaterialDemandRepository.countByCapacityGroupID(entity.getId())
            );
            capacityGroupList.add(response);
        }
        return capacityGroupList;
    }
}
