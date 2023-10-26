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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.DemandSeriesRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkedCapacityGroupMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.MaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

@RequiredArgsConstructor
@Service
@Slf4j
public class CapacityGroupServiceImpl implements CapacityGroupService {

    private final MaterialDemandRepository materialDemandRepository;

    private final CompanyService companyService;
    private final LinkedCapacityGroupMaterialDemandRepository linkedCapacityGroupMaterialDemandRepository;
    private final CapacityGroupRepository capacityGroupRepository;
    private final DemandSeriesRepository demandSeriesRepository;
    private final StatusesService statusesService;
    private final LoggingHistoryService loggingHistoryService;
    private final FavoriteService favoriteService;
    private final StatusManagerImpl statusManager;

    @Override
    public CapacityGroupResponse createCapacityGroup(CapacityGroupRequest capacityGroupRequest, String userID) {
        CapacityGroupEntity capacityGroupEntity = enrichCapacityGroup(capacityGroupRequest);
        capacityGroupEntity.setUserID(UUID.fromString(userID));
        capacityGroupEntity = capacityGroupRepository.save(capacityGroupEntity);
        String cgID = capacityGroupEntity.getId().toString();
        postLogs(cgID, userID);
        for (UUID uuid : capacityGroupRequest.getLinkMaterialDemandIds()) {
            LinkedCapacityGroupMaterialDemandEntity entity = new LinkedCapacityGroupMaterialDemandEntity();
            entity.setCapacityGroupID(capacityGroupEntity.getId());
            entity.setMaterialDemandID(uuid);
            Optional<MaterialDemandEntity> helperEntity = materialDemandRepository.findById(
                entity.getMaterialDemandID()
            );
            List<DemandSeries> matchedMaterialDemands = new ArrayList<>();
            if (helperEntity.isPresent()) {
                MaterialDemandEntity materialDemandEntity = helperEntity.get();
                materialDemandEntity.setLinkStatus(EventType.LINKED);
                statusesService.addOrSubtractTodos(false, userID);
                materialDemandRepository.save(materialDemandEntity);
                matchedMaterialDemands.addAll(materialDemandEntity.getDemandSeries());
            }
            linkedCapacityGroupMaterialDemandRepository.save(entity);
            statusManager.calculateBottleneck(userID,true);
            capacityGroupEntity.setLinkStatus(EventType.GENERAL_EVENT);
            capacityGroupRepository.save(capacityGroupEntity);
        }
        return convertCapacityGroupDto(capacityGroupEntity);
    }

    private void postLogs(String capacityGroupId, String userID) {
        AtomicBoolean isFavorited = new AtomicBoolean(false);
        FavoriteResponse favoriteResponse = favoriteService.getAllFavorites(userID);
        for (SingleCapacityGroupFavoriteResponse singleCapacityGroupFavoriteResponse : favoriteResponse.getCapacityGroups()) {
            if (singleCapacityGroupFavoriteResponse.getId().equals(capacityGroupId)) {
                isFavorited.set(true);
                break;
            }
        }
        LoggingHistoryRequest loggingHistoryRequest = new LoggingHistoryRequest();
        loggingHistoryRequest.setObjectType(EventObjectType.CAPACITY_GROUP.name());
        loggingHistoryRequest.setMaterialDemandId("");
        loggingHistoryRequest.setCapacityGroupId(capacityGroupId);
        loggingHistoryRequest.setEventDescription("Capacity Group created");
        loggingHistoryRequest.setIsFavorited(isFavorited.get());
        loggingHistoryRequest.setEventType(EventType.GENERAL_EVENT.toString());
        loggingHistoryService.createLog(loggingHistoryRequest);
    }

    @Override
    public void linkCapacityGroupToMaterialDemand(LinkCGDSRequest linkCGDSRequest, String userID) {
        Optional<CapacityGroupEntity> optionalCapacityGroupEntity = capacityGroupRepository.findById(
            UUID.fromString(linkCGDSRequest.getCapacityGroupID())
        );

        List<MaterialDemandEntity> materialDemandEntities = new ArrayList<>();

        for (UUID uuid : linkCGDSRequest.getLinkMaterialDemandIds()) {
            Optional<MaterialDemandEntity> materialDemandEntity = materialDemandRepository.findById(uuid);
            if (materialDemandEntity.isPresent()) {
                MaterialDemandEntity materialDemand = materialDemandEntity.get();
                materialDemand.setLinkStatus(EventType.LINKED);
                materialDemandEntities.add(materialDemand);
                statusesService.addOrSubtractTodos(false, userID);
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
                capacityGroupRepository.save(capacityGroupEntity);
                linkedCapacityGroupMaterialDemandRepository.save(entity);
            }
        }
        for (UUID uuid : linkCGDSRequest.getLinkMaterialDemandIds()) {
            Optional<MaterialDemandEntity> materialDemandEntity = materialDemandRepository.findById(uuid);
            if (materialDemandEntity.isPresent()) {
                MaterialDemandEntity demandEntity = materialDemandEntity.get();
                demandEntity.setLinkStatus(EventType.LINKED);
                statusesService.addOrSubtractTodos(false, userID);
                materialDemandRepository.save(demandEntity);
            }
        }
        statusManager.calculateBottleneck(userID,true);
    }

    private CapacityGroupEntity enrichCapacityGroup(CapacityGroupRequest request) {
        CapacityGroupEntity capacityGroupEntity = new CapacityGroupEntity();
        if (!request.getCustomer().isEmpty()) {
            CompanyEntity customer = companyService.getCompanyById(UUID.fromString(request.getCustomer()));
            capacityGroupEntity.setCustomer(customer);
        }
        if (!request.getSupplier().isEmpty()) {
            CompanyEntity supplier = companyService.getCompanyById(UUID.fromString(request.getSupplier()));
            capacityGroupEntity.setSupplier(supplier);
        }

        capacityGroupEntity.setCapacityGroupName(request.getCapacitygroupname());
        capacityGroupEntity.setDefaultActualCapacity(request.getDefaultActualCapacity());
        capacityGroupEntity.setDefaultMaximumCapacity(request.getDefaultMaximumCapacity());
        if (!request.getStartDate().isEmpty()) {
            capacityGroupEntity.setStartDate(LocalDate.parse(request.getStartDate()));
        }
        if (!request.getEndDate().isEmpty()) {
            capacityGroupEntity.setEndDate(LocalDate.parse(request.getEndDate()));
        }

        List<CapacityTimeSeries> capacityTimeSeriesList = new ArrayList<>();
        capacityGroupEntity.setCapacityTimeSeriesList(capacityTimeSeriesList);
        try {
            List<String> mondays = getMondaysBetween(request.getStartDate(), request.getEndDate()); //tem que ser inclusivo
            createCapacityTimeSeries(
                mondays,
                capacityGroupEntity.getDefaultActualCapacity(),
                capacityGroupEntity.getDefaultMaximumCapacity(),
                capacityGroupEntity
            );
        } catch (Exception e) {
            //TODO Throw custom exception
        }

        return capacityGroupEntity;
    }

    @Override
    public SingleCapacityGroup getCapacityGroupById(String capacityGroupId) {
        CapacityGroupEntity capacityGroupEntity = getCapacityGroupEntity(capacityGroupId);
        CapacityGroupResponse response = convertCapacityGroupDto(capacityGroupEntity);
        SingleCapacityGroup singleCapacityGroup = new SingleCapacityGroup();

        singleCapacityGroup.setCapacityGroupId(response.getCapacityGroupId());
        singleCapacityGroup.setCapacityGroupName(response.getCapacitygroupname());
        singleCapacityGroup.setCustomer(response.getCustomer());
        singleCapacityGroup.setSupplier(response.getSupplier());
        singleCapacityGroup.setLinkMaterialDemandIds(response.getLinkMaterialDemandIds());

        singleCapacityGroup.setCapacities(convertToCapacityBody(capacityGroupEntity.getCapacityTimeSeriesList()));

        return singleCapacityGroup;
    }

    @Override
    public List<CapacityGroupDefaultViewResponse> getAll(String userID) {
        List<CapacityGroupEntity> capacityGroupEntityList = capacityGroupRepository.findByUserID(
            UUID.fromString(userID)
        );
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
            if (entity.getLinkStatus() != null) {
                response.setLinkStatus(entity.getLinkStatus().toString());
            }
            capacityGroupList.add(response);
        }
        return capacityGroupList;
    }

    private List<String> getMondaysBetween(String startDate, String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startLocalDate = LocalDate.parse(startDate, formatter);
        LocalDate endLocalDate = LocalDate.parse(endDate, formatter);

        List<String> mondays = new ArrayList<>();
        mondays.add(startDate);

        while (startLocalDate.plusDays(7).isBefore(endLocalDate) || startLocalDate.plusDays(7).isEqual(endLocalDate)) {
            startLocalDate = startLocalDate.plusDays(7);
            mondays.add(startLocalDate.format(formatter));
        }

        return mondays;
    }

    private void createCapacityTimeSeries(
        List<String> mondays,
        float actualCapacity,
        float maximumCapacity,
        CapacityGroupEntity capacityGroupId
    ) {
        for (String monday : mondays) {
            CapacityTimeSeries timeSeries = new CapacityTimeSeries();
            timeSeries.setCalendarWeek(monday);
            timeSeries.setActualCapacity((double) actualCapacity);
            timeSeries.setMaximumCapacity((double) maximumCapacity);
            capacityGroupId.getCapacityTimeSeriesList().add(timeSeries);
            timeSeries.setCapacityGroupEntity(capacityGroupId);
        }
    }

    private List<CapacityBody> convertToCapacityBody(List<CapacityTimeSeries> capacityTimeSeries) {
        List<CapacityBody> bodys = new ArrayList<>();

        for (CapacityTimeSeries capacityTimeSerie : capacityTimeSeries) {
            CapacityBody capacityBody = new CapacityBody();
            capacityBody.setCalendarWeek(capacityTimeSerie.getCalendarWeek());
            capacityBody.setActualCapacity(BigDecimal.valueOf(capacityTimeSerie.getActualCapacity()));
            capacityBody.setMaximumCapacity(BigDecimal.valueOf(capacityTimeSerie.getMaximumCapacity()));
            capacityBody.setCapacityId(capacityTimeSerie.getCapacityGroupEntity().getId().toString());

            bodys.add(capacityBody);
        }
        return bodys;
    }
}
