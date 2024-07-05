/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023, 2024 Contributors to the Eclipse Foundation
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

package org.eclipse.tractusx.demandcapacitymgmt.backend.services.impl;

import eclipse.tractusx.demandcapacitymgm.specification.model.CompanyDto;
import eclipse.tractusx.demandcapacitymgm.specification.model.LoggingHistoryRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.CompanyEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.backend.exceptions.type.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.backend.repositories.CompanyRepository;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.CompanyService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.LoggingHistoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final LoggingHistoryService loggingHistoryService;

    @Override
    public CompanyDto createCompany(CompanyDto companyDto) {
        CompanyEntity entity = new CompanyEntity();
        entity.setCompanyName(companyDto.getCompanyName());
        entity.setBpn(companyDto.getBpn());
        entity.setMyCompany(companyDto.getMyCompany());
        entity.setCountry(companyDto.getCountry());
        entity.setId(UUID.fromString(companyDto.getId()));
        entity.setStreet(companyDto.getStreet());
        entity.setNumber(companyDto.getNumber());
        entity.setZipCode(companyDto.getZipCode());
        companyRepository.save(entity);
        postLogs(entity.getId().toString(), "post");

        return convertEntityToDto(entity);
    }

    private void postLogs(String companyId, String action) {
        LoggingHistoryRequest loggingHistoryRequest = new LoggingHistoryRequest();
        loggingHistoryRequest.setObjectType(EventObjectType.COMPANY.name());
        loggingHistoryRequest.setEventType(EventType.GENERAL_EVENT.toString());
        loggingHistoryRequest.setIsFavorited(false);
        if ("post".equals(action)) {
            loggingHistoryRequest.setEventDescription("Company Created - ID: " + companyId);
        } else if ("delete".equals(action)) {
            loggingHistoryRequest.setEventDescription("Company Deleted - ID: " + companyId);
        }

        loggingHistoryService.createLog(loggingHistoryRequest);
    }

    @Override
    public CompanyEntity getCompanyById(UUID id) {
        Optional<CompanyEntity> company = companyRepository.findById(id);
        if (company.isEmpty()) {
            throw new NotFoundException("6", "40");
        } else company.get().setCount(company.get().getCount() + 1);
        return company.get();
    }

    @Override
    public void deleteCompany(UUID id) {
        Optional<CompanyEntity> company = companyRepository.findById(id);
        if (company.isEmpty()) {
            throw new NotFoundException("", "");
        } else {
            companyRepository.delete(company.get());
            postLogs(id.toString(), "delete");
        }
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

    @Override
    public List<CompanyDto> getTopCompanies() {
        List<CompanyEntity> companyEntityList = companyRepository.findTop5ByOrderByCountDesc();
        return companyEntityList
            .stream()
            .filter(c -> c.getCount() >= 0)
            .map(this::convertEntityToDto)
            .collect(Collectors.toList());
    }
}
