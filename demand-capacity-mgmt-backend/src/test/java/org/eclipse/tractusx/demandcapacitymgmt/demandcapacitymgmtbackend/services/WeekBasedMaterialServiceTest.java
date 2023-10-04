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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandSeriesCategoryDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandSeriesDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandWeekSeriesDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekBasedMaterialDemandRequestDto;
import java.util.List;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.WeekBasedMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl.WeekBasedMaterialServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class WeekBasedMaterialServiceTest {

    @InjectMocks
    private WeekBasedMaterialServiceImpl weekBasedMaterialService;

    @Mock
    private WeekBasedMaterialDemandRepository weekBasedMaterialDemandRepository;

    @Mock
    private LinkDemandService linkDemandService;

    @Mock
    private DemandService demandService;

    private static DemandSeriesDto demandSeriesDto = createDemandSeriesDto();
    private static DemandWeekSeriesDto demandWeekSeriesDto = createDemandWeekSeriesDto();

    private static WeekBasedMaterialDemandRequestDto weekBasedMaterialDemandRequestDto = createWeekBasedMaterialDemandRequestDto();

    @Test
    void shouldCreateWeekBasedMaterial() {
        weekBasedMaterialService.createWeekBasedMaterial(List.of(weekBasedMaterialDemandRequestDto));

        verify(weekBasedMaterialDemandRepository, times(1)).save(any());
    }

    private static DemandSeriesDto createDemandSeriesDto() {
        DemandSeriesDto demandSeriesDto = new DemandSeriesDto();
        demandSeriesDto.setCalendarWeek("2023-06-19");
        demandSeriesDto.setDemand("1");

        return demandSeriesDto;
    }

    private static DemandWeekSeriesDto createDemandWeekSeriesDto() {
        DemandWeekSeriesDto demandWeekSeriesDto = new DemandWeekSeriesDto();

        DemandSeriesCategoryDto demandSeriesCategoryDto = new DemandSeriesCategoryDto();
        demandSeriesCategoryDto.setId("f50c3e71-a1a7-44c9-9de6-2e7aaaf65ac4");

        demandWeekSeriesDto.setCustomerLocation("");
        demandWeekSeriesDto.setDemands(List.of(demandSeriesDto));
        demandWeekSeriesDto.setDemandCategory(demandSeriesCategoryDto);
        demandWeekSeriesDto.setExpectedSupplierLocation("");

        return demandWeekSeriesDto;
    }

    private static WeekBasedMaterialDemandRequestDto createWeekBasedMaterialDemandRequestDto() {
        WeekBasedMaterialDemandRequestDto basedMaterialDemandRequestDto = new WeekBasedMaterialDemandRequestDto();
        WeekBasedMaterialDemandRequest weekBasedMaterialDemandRequest = new WeekBasedMaterialDemandRequest();
        weekBasedMaterialDemandRequest.setMaterialNumberCustomer("test");
        weekBasedMaterialDemandRequest.setMaterialDemandId("f50c3e71-a1a7-44c9-9de6-2e7aaaf65ac4");
        weekBasedMaterialDemandRequest.setSupplier("f50c3e71-a1a7-44c9-9de6-2e7aaaf65ac4");
        weekBasedMaterialDemandRequest.setCustomer("f50c3e71-a1a7-44c9-9de6-2e7aaaf65ac4");
        weekBasedMaterialDemandRequest.setMaterialDescriptionCustomer("");
        weekBasedMaterialDemandRequest.setUnityOfMeasure("un");
        weekBasedMaterialDemandRequest.setDemandSeries(List.of(demandWeekSeriesDto));
        basedMaterialDemandRequestDto.setWeekBasedMaterialDemandRequest(weekBasedMaterialDemandRequest);

        return basedMaterialDemandRequestDto;
    }
}
