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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityTimeSeries;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CompanyEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LinkDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LinkedDemandSeries;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.UnitMeasureEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CompanyService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.UnityOfMeasureService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.DataConverterUtil;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class CapacityGroupServiceImpl implements CapacityGroupService {

    private final CompanyService companyService;

    private final UnityOfMeasureService unityOfMeasureService;

    private final CapacityGroupRepository capacityGroupRepository;

    private final LinkDemandRepository linkDemandRepository;

    @Override
    public void createCapacityGroup(CapacityGroupRequest capacityGroupRequest) {
        validateRequestFields(capacityGroupRequest);

        CapacityGroupEntity capacityGroupEntity = enrichCapacityGroup(capacityGroupRequest);

        saveAll(capacityGroupEntity);
    }

    private void validateRequestFields(CapacityGroupRequest capacityGroupRequest) {
        if (!UUIDUtil.checkValidUUID(capacityGroupRequest.getCustomer())) {
            throw new BadRequestException("not a valid ID");
        }

        if (!UUIDUtil.checkValidUUID(capacityGroupRequest.getSupplier())) {
            throw new BadRequestException("not a valid ID");
        }

        capacityGroupRequest.getSupplierLocations().forEach(UUIDUtil::checkValidUUID);

        List<UUID> expectedSuppliersLocation = capacityGroupRequest
            .getSupplierLocations()
            .stream()
            .map(UUIDUtil::generateUUIDFromString)
            .toList();

        List<CompanyEntity> companyEntities = companyService.getCompanyIn(expectedSuppliersLocation);

        boolean hasAllCompanies = companyEntities
            .stream()
            .map(CompanyEntity::getId)
            .allMatch(expectedSuppliersLocation::contains);

        if (!hasAllCompanies) {
            throw new BadRequestException("Some Invalid Company");
        }

        List<LocalDateTime> dates = capacityGroupRequest
            .getCapacities()
            .stream()
            .map(capacityResponse -> DataConverterUtil.convertFromString(capacityResponse.getCalendarWeek()))
            .toList();

        if (!DataConverterUtil.checkListAllMonday(dates) || !DataConverterUtil.checkDatesSequence(dates)) {
            throw new BadRequestException("not a valid dates");
        }
    }

    private CapacityGroupEntity enrichCapacityGroup(CapacityGroupRequest capacityGroupRequest) {
        UUID capacityGroupId = UUID.randomUUID();
        AtomicReference<String> materialNumberCustomer = new AtomicReference<>("");
        AtomicReference<String> materialDescriptionCustomer = new AtomicReference<>("");
        UnitMeasureEntity unitMeasure = unityOfMeasureService.findById(
            UUIDUtil.generateUUIDFromString(capacityGroupRequest.getUnitOfMeasure())
        );

        CompanyEntity supplier = companyService.getCompanyById(
            UUIDUtil.generateUUIDFromString(capacityGroupRequest.getSupplier())
        );

        CompanyEntity customer = companyService.getCompanyById(
            UUIDUtil.generateUUIDFromString(capacityGroupRequest.getSupplier())
        );

        List<CapacityTimeSeries> capacityTimeSeries = capacityGroupRequest
            .getCapacities()
            .stream()
            .map(
                capacityRequest ->
                    enrichCapacityTimeSeries(
                        DataConverterUtil.convertFromString(capacityRequest.getCalendarWeek()),
                        capacityRequest.getActualCapacity().doubleValue(),
                        capacityRequest.getMaximumCapacity().doubleValue()
                    )
            )
            .toList();

        List<LinkedDemandSeries> linkDemandEntityList = capacityGroupRequest
            .getLinkedDemandSeries()
            .stream()
            .map(
                s -> {
                    LinkDemandEntity linkDemandEntity = linkDemandRepository
                        .findById(UUIDUtil.generateUUIDFromString(s))
                        .orElseThrow();

                    materialNumberCustomer.set(linkDemandEntity.getMaterialNumberCustomer());

                    materialDescriptionCustomer.set(linkDemandEntity.getMaterialNumberCustomer());

                    linkDemandEntity.setLinked(true);
                    linkDemandRepository.save(linkDemandEntity);

                    return LinkedDemandSeries
                        .builder()
                        .materialNumberSupplier(linkDemandEntity.getMaterialNumberSupplier())
                        .materialNumberCustomer(linkDemandEntity.getMaterialNumberCustomer())
                        .build();
                }
            )
            .toList();

        return CapacityGroupEntity
            .builder()
            .id(UUID.randomUUID())
            .capacityGroupId(capacityGroupId)
            .supplierId(supplier)
            .supplierLocation(capacityGroupRequest.getSupplierLocations())
            .customerId(customer)
            .unitMeasure(unitMeasure)
            .changedAt(LocalDateTime.now())
            .capacityTimeSeries(capacityTimeSeries)
            .linkedDemandSeries(linkDemandEntityList)
            .name(capacityGroupRequest.getName())
            .materialNumberCustomer(materialNumberCustomer.get())
            .materialDescriptionCustomer(materialDescriptionCustomer.get())
            .build();
    }

    private CapacityTimeSeries enrichCapacityTimeSeries(
        LocalDateTime calendarWeek,
        Double actualCapacity,
        Double maximumCapacity
    ) {
        return CapacityTimeSeries
            .builder()
            .id(UUID.randomUUID())
            .calendarWeek(calendarWeek)
            .actualCapacity(actualCapacity)
            .maximumCapacity(maximumCapacity)
            .build();
    }

    private void saveAll(CapacityGroupEntity capacityGroupEntity) {
        capacityGroupRepository.save(capacityGroupEntity);
    }
}
