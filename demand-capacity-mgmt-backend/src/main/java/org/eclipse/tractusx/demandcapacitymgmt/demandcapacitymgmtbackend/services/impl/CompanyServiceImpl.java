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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CompanyDto;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CompanyEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CompanyRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CompanyService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Override
    public CompanyEntity createCompany() {
        return null;
    }

    @Override
    public CompanyEntity getCompanyById(UUID id) {
        Optional<CompanyEntity> company = companyRepository.findById(id);

        if (company.isEmpty()) {
            throw new BadRequestException("Company don't exist");
        }

        return company.get();
    }

    @Override
    public List<CompanyEntity> getCompanyIn(List<UUID> uuidList) {
        return companyRepository.findAllById(uuidList);
    }

    @Override
    public CompanyDto convertEntityToDto(CompanyEntity companyEntity) {
        CompanyDto companyDto = new CompanyDto();
        companyDto.setId(String.valueOf(companyEntity.getId()));
        companyDto.setBpn(companyEntity.getBpn());
        companyDto.setMyCompany(companyEntity.getMyCompany());
        companyDto.setCompanyName(companyEntity.getCompanyName());
        companyDto.setCountry(companyEntity.getCountry());
        companyDto.setStreet(companyEntity.getStreet());
        companyDto.setNumber(companyEntity.getNumber());
        companyDto.setZipCode(companyEntity.getZipCode());

        return companyDto;
    }

    @Override
    public List<CompanyDto> getAllCompany() {
        List<CompanyEntity> companyEntityList = companyRepository.findAll();

        return companyEntityList.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }
}
