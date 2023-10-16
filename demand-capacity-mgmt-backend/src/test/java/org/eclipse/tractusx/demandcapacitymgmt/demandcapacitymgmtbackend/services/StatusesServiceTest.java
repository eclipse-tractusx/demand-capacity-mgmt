///*
// *  *******************************************************************************
// *  Copyright (c) 2023 BMW AG
// *  Copyright (c) 2023 Contributors to the Eclipse Foundation
// *
// *    See the NOTICE file(s) distributed with this work for additional
// *    information regarding copyright ownership.
// *
// *    This program and the accompanying materials are made available under the
// *    terms of the Apache License, Version 2.0 which is available at
// *    https://www.apache.org/licenses/LICENSE-2.0.
// *
// *    Unless required by applicable law or agreed to in writing, software
// *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// *    License for the specific language governing permissions and limitations
// *    under the License.
// *
// *    SPDX-License-Identifier: Apache-2.0
// *    ********************************************************************************
// */
//
//package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.times;
//import static org.mockito.Mockito.verify;
//
//import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusDto;
//import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusRequest;
//import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.StatusesRepository;
//import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl.StatusesServiceImpl;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//
//@ExtendWith(SpringExtension.class)
//public class StatusesServiceTest {
//
//    @InjectMocks
//    private StatusesServiceImpl statusesService;
//
//    @Mock
//    private StatusesRepository statusesRepository;
//
//    private final StatusRequest statusRequest = createStatusRequest();
//
//    @Test
//    void shouldCreateStatusesObject() {
//        statusesService.postStatuses(statusRequest);
//
//        verify(statusesRepository, times(1)).save(any());
//    }
//
//    StatusRequest createStatusRequest() {
//        StatusRequest statusRequest = new StatusRequest();
//        statusRequest.setStatusDegredation(createStatusDto());
//        statusRequest.setStatusImprovement(createStatusDto());
//        statusRequest.setTodos(createStatusDto());
//        statusRequest.setGeneral(createStatusDto());
//        statusRequest.setOverallTodos(createStatusDto());
//        statusRequest.setOverallStatusDegredation(createStatusDto());
//        statusRequest.setOverallStatusImprovement(createStatusDto());
//        statusRequest.setOverallGeneral(createStatusDto());
//        return statusRequest;
//    }
//
//    StatusDto createStatusDto() {
//        StatusDto statusDto = new StatusDto();
//        statusDto.setCount(2);
//        return statusDto;
//    }
//}
