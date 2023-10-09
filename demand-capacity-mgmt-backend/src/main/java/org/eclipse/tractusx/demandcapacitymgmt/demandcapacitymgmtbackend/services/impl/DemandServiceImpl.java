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
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.FavoriteType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.MaterialDemandStatus;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.DemandSeriesRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkedCapacityGroupMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.MaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.DataConverterUtil;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

@RequiredArgsConstructor
@Service
@Slf4j
public class DemandServiceImpl implements DemandService {

    private final CompanyService companyService;

    private final UnityOfMeasureService unityOfMeasureService;

    private final MaterialDemandRepository materialDemandRepository;

    private final DemandCategoryService demandCategoryService;

    private final FavoriteService favoriteService;

    private final LoggingHistoryService loggingHistoryService;

    private final DemandSeriesRepository demandSeriesRepository;

    private final LinkedCapacityGroupMaterialDemandRepository linkedCapacityGroupMaterialDemandRepository;

    @Override
    public MaterialDemandResponse createDemand(MaterialDemandRequest materialDemandRequest) {
        validateMaterialDemandRequestFields(materialDemandRequest);
        MaterialDemandEntity materialDemandEntity = convertDtoToEntity(materialDemandRequest);
        materialDemandEntity = materialDemandRepository.save(materialDemandEntity);
        postLogs(materialDemandEntity.getId().toString(), "MATERIAL DEMAND Created");
        return convertDemandResponseDto(materialDemandEntity);
    }

    private void postLogs(String materialDemandId, String eventDescription) {
        AtomicBoolean isFavorited = new AtomicBoolean(false);
        favoriteService
            .getAllFavoritesByType(FavoriteType.MATERIAL_DEMAND.toString())
            .forEach(
                favoriteResponse -> {
                    if (favoriteResponse.getfTypeId().equals(materialDemandId)) {
                        isFavorited.set(true);
                    }
                }
            );
        LoggingHistoryRequest loggingHistoryRequest = new LoggingHistoryRequest();
        loggingHistoryRequest.setObjectType(EventObjectType.MATERIAL_DEMAND.name());
        loggingHistoryRequest.setMaterialDemandId(materialDemandId);
        loggingHistoryRequest.setIsFavorited(isFavorited.get());
        loggingHistoryRequest.setEventDescription(eventDescription);

        // TODO : Add EventType
        loggingHistoryRequest.setEventType(EventType.GENERAL_EVENT.toString());

        loggingHistoryService.createLog(loggingHistoryRequest);
    }

    @Override
    public List<MaterialDemandResponse> getAllDemandsByProjectId() {
        List<MaterialDemandEntity> demandEntityList = materialDemandRepository.findAll();

        return demandEntityList.stream().map(this::convertDemandResponseDto).toList();
    }

    @Override
    public MaterialDemandResponse getDemandById(String demandId) {
        MaterialDemandEntity demand = getDemandEntity(demandId);
        return convertDemandResponseDto(demand);
    }

    @Override
    public MaterialDemandResponse updateDemand(String demandId, MaterialDemandRequest materialDemandRequest) {
        MaterialDemandEntity demand = convertDtoToEntity(materialDemandRequest);
        demand.setId(UUID.fromString(demandId));

        demand = materialDemandRepository.save(demand);
        postLogs(demandId, "MATERIAL DEMAND Updated");
        return convertDemandResponseDto(demand);
    }

    @Override
    public MaterialDemandEntity getDemandEntityById(String demandId) {
        return getDemandEntity(demandId);
    }

    @Override
    public void deleteDemandById(String demandId) {
        MaterialDemandEntity demand = getDemandEntity(demandId);
        postLogs(demandId, "MATERIAL DEMAND Deleted");
        materialDemandRepository.delete(demand);
    }

    @Override
    public List<MaterialDemandEntity> getAllByStatus(MaterialDemandStatus status) {
        return materialDemandRepository.findAllByStatus(status);
    }

    @Override
    public DemandSeriesCompositeResponse getAllDemandsByCompositeKey(
        DemandSeriesCompositeRequest demandSeriesCompositeRequest
    ) {
        List<DemandSeries> demandSeriesEntities = demandSeriesRepository.ByCategoryIDCustomerIDMaterialNrCustomer(
            UUID.fromString(demandSeriesCompositeRequest.getCustomerID()),
            UUID.fromString(demandSeriesCompositeRequest.getDemandCategoryCodeID()),
            demandSeriesCompositeRequest.getMaterialNumberCustomer()
        );

        DemandSeriesCompositeResponse demandSeriesCompositeResponse = new DemandSeriesCompositeResponse();
        List<LinkedDemandMaterialCompositeResponse> linkedDemandMaterialCompositeResponses = new ArrayList<>();

        for (DemandSeries demandSeries : demandSeriesEntities) {
            LinkedDemandMaterialCompositeResponse compositeResponse = new LinkedDemandMaterialCompositeResponse();

            DemandCategoryResponse demandCategory = demandCategoryService.convertEntityToDto(
                demandCategoryService.findById(demandSeries.getDemandCategory().getId())
            );
            compositeResponse.setDemandCategory(demandCategory);

            Optional<MaterialDemandEntity> materialDemand = materialDemandRepository.findById(
                demandSeries.getMaterialDemand().getId()
            );
            if (materialDemand.isPresent()) {
                MaterialDemandResponse materialDemandResponse = convertDemandResponseDto(materialDemand.get());
                compositeResponse.setMaterialDemandID(materialDemandResponse.getId());
                compositeResponse.setCustomerLocation(materialDemandResponse.getCustomer());
                List<CompanyDto> supplierLocations = new ArrayList<>();
                for (String locations : demandSeries.getExpectedSupplierLocation()) {
                    CompanyEntity entity = companyService.getCompanyById(UUID.fromString(locations));
                    CompanyDto companyDto = new CompanyDto();
                    companyDto.setBpn(entity.getBpn());
                    companyDto.setCompanyName(entity.getCompanyName());
                    companyDto.setId(entity.getId().toString());
                    companyDto.setMyCompany(entity.getMyCompany());
                    companyDto.setCountry(entity.getCountry());
                    companyDto.setNumber(entity.getNumber());
                    companyDto.setStreet(entity.getStreet());
                    companyDto.setZipCode(entity.getZipCode());
                    supplierLocations.add(companyDto);
                }
                compositeResponse.setExpectedSupplierLocation(supplierLocations);
            }

            List<MaterialDemandSeriesValue> materialDemandSeriesValues = new ArrayList<>();

            for (DemandSeriesValues values : demandSeries.getDemandSeriesValues()) {
                MaterialDemandSeriesValue demandSeriesValue = new MaterialDemandSeriesValue();
                demandSeriesValue.setDemand(BigDecimal.valueOf(values.getDemand()));
                demandSeriesValue.setCalendarWeek(values.getCalendarWeek().toString());
                materialDemandSeriesValues.add(demandSeriesValue);
            }
            compositeResponse.setDemandSeriesValues(materialDemandSeriesValues);
            compositeResponse.setDemandSeriesID(demandSeries.getId().toString());
            linkedDemandMaterialCompositeResponses.add(compositeResponse);
        }
        demandSeriesCompositeResponse.setDemandSeries(linkedDemandMaterialCompositeResponses);
        return demandSeriesCompositeResponse;
    }

    @Override
    public void unlinkComposites(DemandSeriesUnlinkRequest demandSeriesUnlinkRequest) {
        UUID cgID = UUID.fromString(demandSeriesUnlinkRequest.getCapacityGroupID());
        UUID mdID = UUID.fromString(demandSeriesUnlinkRequest.getMaterialDemandID());
        linkedCapacityGroupMaterialDemandRepository.deleteByCapacityGroupIDAndMaterialDemandID(cgID, mdID);
    }

    private MaterialDemandEntity getDemandEntity(String demandId) {
        UUIDUtil.checkValidUUID(demandId);
        UUID uuid = UUIDUtil.generateUUIDFromString(demandId);
        Optional<MaterialDemandEntity> demand = materialDemandRepository.findById(uuid);

        if (demand.isEmpty()) {
            throw new NotFoundException(
                404,
                "Material demand not found",
                new ArrayList<>(List.of("provided UUID for material demand was not found. - " + uuid))
            );
        }

        return demand.get();
    }

    private MaterialDemandResponse convertDemandResponseDto(MaterialDemandEntity materialDemandEntity) {
        MaterialDemandResponse responseDto = new MaterialDemandResponse();

        CompanyDto customer = null;
        if (materialDemandEntity.getCustomerId() != null) {
            customer = companyService.convertEntityToDto(materialDemandEntity.getCustomerId());
        }

        CompanyDto supplier = null;
        if (materialDemandEntity.getSupplierId() != null) {
            supplier = companyService.convertEntityToDto(materialDemandEntity.getSupplierId());
        }

        responseDto.setMaterialDescriptionCustomer(materialDemandEntity.getMaterialDescriptionCustomer());
        responseDto.setMaterialNumberCustomer(materialDemandEntity.getMaterialNumberCustomer());
        responseDto.setMaterialNumberSupplier(materialDemandEntity.getMaterialNumberSupplier());
        responseDto.setCustomer(customer);
        responseDto.setSupplier(supplier);
        responseDto.setChangedAt(materialDemandEntity.getChangedAt().toString());
        responseDto.setId(materialDemandEntity.getId().toString());

        UnitMeasure unitMeasure = enrichUnitMeasure(materialDemandEntity.getUnitMeasure());

        List<MaterialDemandSeriesResponse> materialDemandSeriesResponse = materialDemandEntity
            .getDemandSeries()
            .stream()
            .map(this::enrichMaterialDemandSeriesResponse)
            .toList();

        responseDto.setUnitMeasureId(unitMeasure);

        responseDto.setDemandSeries(materialDemandSeriesResponse);

        return responseDto;
    }

    private void validateMaterialDemandRequestFields(MaterialDemandRequest materialDemandRequest) {
        if (!UUIDUtil.checkValidUUID(materialDemandRequest.getCustomerId())) {
            throw new BadRequestException(
                400,
                "Not a valid customer ID",
                new ArrayList<>(List.of(materialDemandRequest.getCustomerId()))
            );
        }

        if (!UUIDUtil.checkValidUUID(materialDemandRequest.getSupplierId())) {
            throw new BadRequestException(
                400,
                "Not a valid supplier ID",
                new ArrayList<>(List.of(materialDemandRequest.getSupplierId()))
            );
        }

        materialDemandRequest
            .getMaterialDemandSeries()
            .forEach(
                materialDemandSeries -> {
                    if (!UUIDUtil.checkValidUUID(materialDemandSeries.getCustomerLocationId())) {
                        throw new BadRequestException(
                            400,
                            "Not a valid customer location ID",
                            new ArrayList<>(List.of("provided ID - " + materialDemandSeries.getCustomerLocationId()))
                        );
                    }

                    if (!UUIDUtil.checkValidUUID(materialDemandSeries.getDemandCategoryId())) {
                        throw new BadRequestException(
                            400,
                            "Not a valid demand category ID",
                            new ArrayList<>(List.of("provided ID - " + materialDemandSeries.getDemandCategoryId()))
                        );
                    }

                    List<LocalDateTime> dates = materialDemandSeries
                        .getDemandSeriesValues()
                        .stream()
                        .map(
                            materialDemandSeriesValue ->
                                DataConverterUtil.convertFromString(materialDemandSeriesValue.getCalendarWeek())
                        )
                        .toList();

                    if (
                        Boolean.TRUE.equals(!DataConverterUtil.checkListAllMonday(dates)) ||
                        Boolean.TRUE.equals(!DataConverterUtil.checkDatesSequence(dates))
                    ) {
                        throw new BadRequestException(
                            400,
                            "Dates provided failed to verify",
                            new ArrayList<>(
                                List.of(
                                    "Dates need to be all Monday",
                                    "Dates need to be aligned one week apart (Ex: monday to monday)"
                                )
                            )
                        );
                    }

                    materialDemandSeries.getExpectedSupplierLocationId().forEach(UUIDUtil::checkValidUUID);

                    List<UUID> expectedSuppliersLocation = materialDemandSeries
                        .getExpectedSupplierLocationId()
                        .stream()
                        .map(UUIDUtil::generateUUIDFromString)
                        .toList();

                    List<CompanyEntity> companyEntities = companyService.getCompanyIn(expectedSuppliersLocation);

                    boolean hasAllCompanies = companyEntities
                        .stream()
                        .map(CompanyEntity::getId)
                        .allMatch(expectedSuppliersLocation::contains);

                    if (!hasAllCompanies) {
                        throw new BadRequestException(
                            400,
                            "Not a valid company",
                            new ArrayList<>(List.of("hasCompanies returned false."))
                        );
                    }
                }
            );
    }

    private MaterialDemandEntity convertDtoToEntity(MaterialDemandRequest materialDemandRequest) {
        CompanyEntity supplierEntity = companyService.getCompanyById(
            UUIDUtil.generateUUIDFromString(materialDemandRequest.getSupplierId())
        );

        CompanyEntity customerEntity = companyService.getCompanyById(
            UUIDUtil.generateUUIDFromString(materialDemandRequest.getSupplierId())
        );

        UnitMeasureEntity unitMeasure = unityOfMeasureService.findById(
            UUID.fromString(materialDemandRequest.getUnitMeasureId())
        );

        List<DemandSeries> demandSeriesList = materialDemandRequest
            .getMaterialDemandSeries()
            .stream()
            .map(
                materialDemandSeries -> {
                    DemandCategoryEntity demandCategory = demandCategoryService.findById(
                        UUIDUtil.generateUUIDFromString(materialDemandSeries.getDemandCategoryId())
                    );
                    return enrichDemandSeries(materialDemandSeries, customerEntity, demandCategory);
                }
            )
            .toList();

        return MaterialDemandEntity
            .builder()
            .materialDescriptionCustomer(materialDemandRequest.getMaterialDescriptionCustomer())
            .materialNumberCustomer(materialDemandRequest.getMaterialNumberCustomer())
            .materialNumberSupplier(materialDemandRequest.getMaterialNumberSupplier())
            .customerId(customerEntity)
            .supplierId(supplierEntity)
            .unitMeasure(unitMeasure)
            .demandSeries(demandSeriesList)
            .changedAt(LocalDateTime.now())
            .build();
    }

    private DemandSeries enrichDemandSeries(
        MaterialDemandSeries materialDemandSeries,
        CompanyEntity customerEntity,
        DemandCategoryEntity demandCategory
    ) {
        List<DemandSeriesValues> demandSeriesValues = enrichDemandSeriesValues(
            materialDemandSeries.getDemandSeriesValues()
        );

        return DemandSeries
            .builder()
            .expectedSupplierLocation(materialDemandSeries.getExpectedSupplierLocationId())
            .customerLocation(customerEntity)
            .demandCategory(demandCategory)
            .demandSeriesValues(demandSeriesValues)
            .build();
    }

    private List<DemandSeriesValues> enrichDemandSeriesValues(List<MaterialDemandSeriesValue> demandSeriesValues) {
        return demandSeriesValues
            .stream()
            .map(
                materialDemandSeriesValue ->
                    DemandSeriesValues
                        .builder()
                        .demand(materialDemandSeriesValue.getDemand().doubleValue())
                        .calendarWeek(LocalDate.parse(materialDemandSeriesValue.getCalendarWeek()))
                        .build()
            )
            .toList();
    }

    private MaterialDemandSeriesResponse enrichMaterialDemandSeriesResponse(DemandSeries demandSeries) {
        List<UUID> uuidList = demandSeries
            .getExpectedSupplierLocation()
            .stream()
            .map(UUIDUtil::generateUUIDFromString)
            .toList();
        List<CompanyEntity> companyEntities = companyService.getCompanyIn(uuidList);

        List<CompanyDto> expectedSupplierLocation = companyEntities
            .stream()
            .map(companyService::convertEntityToDto)
            .toList();

        CompanyDto customer = companyService.convertEntityToDto(demandSeries.getCustomerLocation());

        MaterialDemandSeriesResponse materialDemandSeriesResponse = new MaterialDemandSeriesResponse();
        materialDemandSeriesResponse.setCustomerLocation(customer);
        materialDemandSeriesResponse.setExpectedSupplierLocation(expectedSupplierLocation);

        List<MaterialDemandSeriesValue> materialDemandSeriesValues = demandSeries
            .getDemandSeriesValues()
            .stream()
            .map(this::enrichMaterialDemandSeriesValue)
            .toList();

        DemandCategoryResponse demandCategory = enrichDemandCategory(demandSeries.getDemandCategory());

        materialDemandSeriesResponse.setDemandCategory(demandCategory);

        materialDemandSeriesResponse.setDemandSeriesValues(materialDemandSeriesValues);

        return materialDemandSeriesResponse;
    }

    private MaterialDemandSeriesValue enrichMaterialDemandSeriesValue(DemandSeriesValues demandSeriesValues) {
        MaterialDemandSeriesValue materialDemandSeriesValue = new MaterialDemandSeriesValue();
        materialDemandSeriesValue.setDemand(BigDecimal.valueOf(demandSeriesValues.getDemand()));
        materialDemandSeriesValue.setCalendarWeek(demandSeriesValues.getCalendarWeek().toString());

        return materialDemandSeriesValue;
    }

    private UnitMeasure enrichUnitMeasure(UnitMeasureEntity unitMeasureEntity) {
        UnitMeasure unitMeasure = new UnitMeasure();

        unitMeasure.setId(unitMeasureEntity.getId().toString());
        unitMeasure.setDimension(unitMeasureEntity.getDimension());
        unitMeasure.setUnCode(unitMeasureEntity.getUnCode());
        unitMeasure.setDescription(unitMeasureEntity.getDescription());
        unitMeasure.setDescriptionGerman(unitMeasureEntity.getDescriptionGerman());
        unitMeasure.setUnSymbol(unitMeasureEntity.getUnSymbol());
        unitMeasure.setCxSymbol(unitMeasureEntity.getCxSymbol());

        return unitMeasure;
    }

    private DemandCategoryResponse enrichDemandCategory(DemandCategoryEntity demandCategoryEntity) {
        DemandCategoryResponse demandCategory = new DemandCategoryResponse();
        demandCategory.setId(demandCategoryEntity.getId().toString());
        demandCategory.setDemandCategoryName(demandCategoryEntity.getDemandCategoryName());
        demandCategory.setDemandCategoryCode(demandCategoryEntity.getDemandCategoryCode());
        return demandCategory;
    }
}
