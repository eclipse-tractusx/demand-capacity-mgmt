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

package org.eclipse.tractusx.demandcapacitymgmt.backend.services;

import eclipse.tractusx.demandcapacitymgm.specification.model.CompanyDto;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.CompanyEntity;

import java.util.List;
import java.util.UUID;

public interface CompanyService {
    CompanyDto createCompany(CompanyDto companyDto);

    CompanyEntity getCompanyById(UUID id);

    void deleteCompany(UUID id);

    List<CompanyEntity> getCompanyIn(List<UUID> uuidList);

    CompanyDto convertEntityToDto(CompanyEntity companyEntity);

    List<CompanyDto> getAllCompany();

    List<CompanyDto> getTopCompanies();
}
