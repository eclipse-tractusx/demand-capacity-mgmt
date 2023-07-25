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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandCategoryResponse;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.DemandCategoryEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.DemandCategoryRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.DemandCategoryService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class DemandCategoryServiceImpl implements DemandCategoryService {

    private final DemandCategoryRepository demandCategoryRepository;

    @Override
    public DemandCategoryEntity findById(UUID id) {
        Optional<DemandCategoryEntity> demandCategory = demandCategoryRepository.findById(id);

        if (demandCategory.isEmpty()) {
            throw new BadRequestException("not a valid ID");
        }

        return demandCategory.get();
    }

    @Override
    public DemandCategoryResponse convertEntityToDto(DemandCategoryEntity demandCategory) {
        DemandCategoryResponse demandCategoryResponse = new DemandCategoryResponse();
        demandCategoryResponse.setId(demandCategory.getId().toString());
        demandCategoryResponse.setDemandCategoryCode(demandCategory.getDemandCategoryCode());
        demandCategoryResponse.setDemandCategoryName(demandCategory.getDemandCategoryName());

        return demandCategoryResponse;
    }

    @Override
    public List<DemandCategoryResponse> getAllDemandCategory() {
        List<DemandCategoryEntity> demandCategoryEntityList = demandCategoryRepository.findAll();

        return demandCategoryEntityList.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }
}
