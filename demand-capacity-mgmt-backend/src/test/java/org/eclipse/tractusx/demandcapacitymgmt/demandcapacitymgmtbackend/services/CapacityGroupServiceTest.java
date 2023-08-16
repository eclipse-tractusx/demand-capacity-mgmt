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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityRequest;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekBasedMaterialDemandRequestDto;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.CapacityGroupStatus;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.DemandCategoryRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl.CapacityGroupServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class CapacityGroupServiceTest {

    @InjectMocks
    private CapacityGroupServiceImpl capacityGroupService;

    @Mock
    private CompanyService companyService;

    @Mock
    private UnityOfMeasureService unityOfMeasureService;

    @Mock
    private CapacityGroupRepository capacityGroupRepository;

    @Mock
    private LinkDemandRepository linkDemandRepository;

    @Mock
    private DemandCategoryService demandCategoryService;

    private static CapacityGroupRequest capacityGroupRequest = createCapacityGroupRequest();

    private static CompanyEntity company = createCompanyEntity();

    private LinkDemandEntity linkDemandEntity = createLinkDemandEntity();

    private static UnitMeasureEntity unitMeasure = createUnitMeasureEntity();

    private static WeekBasedMaterialDemandEntity weekBasedMaterialDemandEntity = createWeekBasedMaterialDemandEntity();

    private static DemandCategoryEntity demandCategoryEntity = createDemandCategoryEntity();
    private CapacityGroupEntity capacityGroupEntity = createCapacityGroupEntity();

    @Test
    void shouldCreateCapacityGroup() {
        when(companyService.getCompanyIn(any())).thenReturn(List.of(company));
        when(unityOfMeasureService.findById(any())).thenReturn(null);
        when(companyService.getCompanyById(any())).thenReturn(company);
        when(demandCategoryService.findById(any())).thenReturn(demandCategoryEntity);
        when(linkDemandRepository.findById(any())).thenReturn(Optional.of(linkDemandEntity));
       // when(demandCategoryService.save(any())).thenReturn(demandCategoryEntity);
        when(capacityGroupRepository.save(any())).thenReturn(capacityGroupEntity);

        capacityGroupService.createCapacityGroup(capacityGroupRequest);

        verify(capacityGroupRepository, times(1)).save(any());
    }

    private static CapacityGroupRequest createCapacityGroupRequest() {
        CapacityGroupRequest capacityGroupRequest = new CapacityGroupRequest();

        CapacityRequest capacityRequest = new CapacityRequest();
        capacityRequest.setActualCapacity(BigDecimal.valueOf(20));
        capacityRequest.setMaximumCapacity(BigDecimal.valueOf(20));
        capacityRequest.setCalendarWeek("2023-06-19");

        //08b95a75-11a7-4bea-a958-821b9cb01641
        capacityGroupRequest.setCustomer("08b95a75-11a7-4bea-a958-821b9cb01641");
        capacityGroupRequest.setSupplier("08b95a75-11a7-4bea-a958-821b9cb01641");
        capacityGroupRequest.setName("Test");
        capacityGroupRequest.setUnitOfMeasure("529f760c-71f4-4d0d-a924-7e4a5b645c5e");
        capacityGroupRequest.setLinkedDemandSeries(List.of("e6ee8fc4-60e5-4af8-b878-e87105d834f2"));
        capacityGroupRequest.setSupplierLocations(List.of("08b95a75-11a7-4bea-a958-821b9cb01641"));
        capacityGroupRequest.setCapacities(List.of(capacityRequest));

        return capacityGroupRequest;
    }

    private static CompanyEntity createCompanyEntity() {
        return CompanyEntity
                .builder()
                .id(UUID.fromString("08b95a75-11a7-4bea-a958-821b9cb01641"))
                .myCompany("Test")
                .companyName("Test")
                .build();
    }

    private static LinkDemandEntity createLinkDemandEntity() {
        return LinkDemandEntity
                .builder()
                .linked(false)
                .demandCategoryId("08b95a75-11a7-4bea-a958-821b9cb01642")
                .materialNumberSupplier("08b95a75-11a7-4bea-a958-821b9cb01642")
                .materialNumberCustomer("08b95a75-11a7-4bea-a958-821b9cb01642")
                .weekBasedMaterialDemand(weekBasedMaterialDemandEntity)

                .build();
    }

    private static UnitMeasureEntity createUnitMeasureEntity() {
        return UnitMeasureEntity
                .builder()
                .id(UUID.fromString("08b95a75-11a7-4bea-a958-821b9cb01643"))
                .codeValue("Kilogram")
                .displayValue("Kg")
                .build();
    }

    private static CapacityGroupEntity createCapacityGroupEntity() {
        CapacityGroupEntity capacityGroup = CapacityGroupEntity
                .builder()
                .id(UUID.fromString("08b95a75-11a7-4bea-a958-821b9cb01642"))
                .capacityGroupId(UUID.fromString("08b95a75-11a7-4bea-a958-821b9cb01642"))
                .materialDescriptionCustomer("08b95a75-11a7-4bea-a958-821b9cb01641")
                .materialNumberCustomer("08b95a75-11a7-4bea-a958-821b9cb01641")
                .changedAt(LocalDateTime.now())
                .customerId(company)
                .supplierId(company)
                .unitMeasure(unitMeasure)
                .linkedDemandSeries(new ArrayList<>())
                .supplierLocation(new ArrayList<>())
                .name("08b95a75-11a7-4bea-a958-821b9cb01642")
                .status(CapacityGroupStatus.READY_SYNCHRONIZE)
                .build();

        List<CapacityTimeSeries> timeSeriesList = createCapacityTimeSeries(capacityGroup);

        capacityGroup.setCapacityTimeSeries(timeSeriesList);

        return capacityGroup;
    }

    private static List<CapacityTimeSeries> createCapacityTimeSeries(CapacityGroupEntity capacityGroup) {
        CapacityTimeSeries capacityTimeSeries1 = new CapacityTimeSeries();
        capacityTimeSeries1.setId(UUID.randomUUID());
        capacityTimeSeries1.setCalendarWeek(LocalDateTime.now());
        capacityTimeSeries1.setActualCapacity(100.0);
        capacityTimeSeries1.setMaximumCapacity(150.0);
        capacityTimeSeries1.setCapacityGroupEntity(capacityGroup);

        CapacityTimeSeries capacityTimeSeries2 = new CapacityTimeSeries();
        capacityTimeSeries2.setId(UUID.randomUUID());
        capacityTimeSeries2.setCalendarWeek(LocalDateTime.now());
        capacityTimeSeries2.setActualCapacity(120.0);
        capacityTimeSeries2.setMaximumCapacity(160.0);
        capacityTimeSeries2.setCapacityGroupEntity(capacityGroup);

        List<CapacityTimeSeries> timeSeriesList = new ArrayList<>();
        timeSeriesList.add(capacityTimeSeries1);
        timeSeriesList.add(capacityTimeSeries2);

        return timeSeriesList;
    }


    private static WeekBasedMaterialDemandEntity createWeekBasedMaterialDemandEntity(){

        WeekBasedMaterialDemandRequestDto dto = new WeekBasedMaterialDemandRequestDto();
        dto.setUnityOfMeasure("kg");
        dto.setCustomer("08b95a75-11a7-4bea-a958-821b9cb01643");
        dto.setMaterialDemandId("ID");
        dto.setMaterialNumberCustomer("IDD");
        dto.setMaterialDescriptionCustomer("08b95a75-11a7-4bea-a958-821b9cb01643");
        dto.setChangedAt("now");


        WeekBasedMaterialDemandEntity entity = WeekBasedMaterialDemandEntity
                .builder()
                .id(Long.valueOf("4"))
                .viewed(false)
                .weekBasedMaterialDemand(dto)
                .build();
        return entity;
    }

    private static DemandCategoryEntity createDemandCategoryEntity(){
        DemandCategoryEntity demandCategoryEntity = DemandCategoryEntity
                .builder()
                .id(UUID.fromString("08b95a75-11a7-4bea-a958-821b9cb01642"))
                .demandCategoryCode("Test")
                .demandCategoryName("test2")
                .build();
        return demandCategoryEntity;
    }
}
