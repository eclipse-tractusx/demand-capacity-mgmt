/*
 * *******************************************************************************
 *   Copyright (c) 2023 BMW AG
 *   Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *   See the NOTICE file(s) distributed with this work for additional
 *   information regarding copyright ownership.
 *
 *   This program and the accompanying materials are made available under the
 *   terms of the Apache License, Version 2.0 which is available at
 *   https://www.apache.org/licenses/LICENSE-2.0.
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *   WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *   License for the specific language governing permissions and limitations
 *   under the License.
 *
 *   SPDX-License-Identifier: Apache-2.0
 *   ********************************************************************************
 *
 */

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacitiesDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandCategoryDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LinkedDemandSeriesRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekBasedCapacityGroupRequest;
import java.util.List;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.DemandSeries;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.WeekBasedCapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.MaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.WeekBasedCapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl.WeekBasedCapacityGroupServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class WeekBasedCapacityGroupServiceTest {

    @InjectMocks
    private WeekBasedCapacityGroupServiceImpl weekBasedCapacityGroupService;

    @Mock
    private WeekBasedCapacityGroupRepository weekBasedCapacityGroupRepository;

    @Mock
    private CapacityGroupService capacityGroupService;

    @Mock
    private MaterialDemandRepository materialDemandRepository;

    private static DemandCategoryDto demandCategoryDto = createDemandCategoryDto();
    private static CapacitiesDto capacitiesDto = createCapacitiesDto();
    private static LinkedDemandSeriesRequest linkedDemandSeriesRequest = createLinkedDemandSeriesRequest();
    private static WeekBasedCapacityGroupRequest weekBasedCapacityGroupRequest = createWeekBasedCapacityGroupRequest();
    private static WeekBasedCapacityGroupEntity weekBasedCapacityGroup = createWeekBasedCapacityGroupEntity();
    private static MaterialDemandEntity materialDemandEntity = createMaterialDemandEntity();

    @Test
    void shouldCreateWeekBasedCapacityGroup() {
        weekBasedCapacityGroupService.createWeekBasedCapacityGroup(List.of(weekBasedCapacityGroupRequest));

        verify(weekBasedCapacityGroupRepository, times(1)).save(any());
    }

    @Test
    void shouldReceiveWeekBasedCapacityGroup() {
        when(weekBasedCapacityGroupRepository.getAllByViewed(false)).thenReturn(List.of(weekBasedCapacityGroup));
        when(
            materialDemandRepository.findAllByMaterialNumberCustomerAndDemandSeriesCustomerLocationAndDemandCategory(
                any(),
                any(),
                any()
            )
        )
            .thenReturn(List.of(materialDemandEntity));

        weekBasedCapacityGroupService.receiveWeekBasedCapacityGroup();

        verify(materialDemandRepository, times(1)).saveAll(any());
    }

    private static WeekBasedCapacityGroupRequest createWeekBasedCapacityGroupRequest() {
        WeekBasedCapacityGroupRequest weekBasedCapacityGroupRequest = new WeekBasedCapacityGroupRequest();

        weekBasedCapacityGroupRequest.setName("test");
        weekBasedCapacityGroupRequest.setCustomer("test");
        weekBasedCapacityGroupRequest.setCapacityGroupId("2c478e29-3909-481a-99b9-df3d0db97a4c");
        weekBasedCapacityGroupRequest.setUnityOfMeasure("un");

        weekBasedCapacityGroupRequest.setCapacities(List.of(capacitiesDto));
        weekBasedCapacityGroupRequest.setLinkedDemandSeries(List.of(linkedDemandSeriesRequest));
        weekBasedCapacityGroupRequest.setSupplierLocations(List.of(""));

        return weekBasedCapacityGroupRequest;
    }

    private static CapacitiesDto createCapacitiesDto() {
        CapacitiesDto capacitiesDto = new CapacitiesDto();
        capacitiesDto.setActualCapacity("1");
        capacitiesDto.setMaximumCapacity("10");
        capacitiesDto.setCalendarWeek("2023-06-19");

        return capacitiesDto;
    }

    private static LinkedDemandSeriesRequest createLinkedDemandSeriesRequest() {
        LinkedDemandSeriesRequest linkedDemandSeriesRequest = new LinkedDemandSeriesRequest();

        linkedDemandSeriesRequest.setDemandCategory(demandCategoryDto);
        linkedDemandSeriesRequest.setCustomerLocation("");
        linkedDemandSeriesRequest.setMaterialNumberCustomer("test");
        linkedDemandSeriesRequest.setMaterialNumberSupplier("");

        return linkedDemandSeriesRequest;
    }

    private static DemandCategoryDto createDemandCategoryDto() {
        DemandCategoryDto demandCategoryDto = new DemandCategoryDto();
        demandCategoryDto.setDemandCategory("default");

        return demandCategoryDto;
    }

    private static WeekBasedCapacityGroupEntity createWeekBasedCapacityGroupEntity() {
        return WeekBasedCapacityGroupEntity
            .builder()
            .viewed(false)
            .id(1l)
            .weekBasedCapacityGroup(weekBasedCapacityGroupRequest)
            .build();
    }

    private static MaterialDemandEntity createMaterialDemandEntity() {
        DemandSeries demandSeries = DemandSeries.builder().build();

        return MaterialDemandEntity.builder().demandSeries(List.of(demandSeries)).build();
    }
}
