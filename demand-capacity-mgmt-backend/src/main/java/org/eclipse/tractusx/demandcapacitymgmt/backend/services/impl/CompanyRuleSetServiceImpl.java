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

import eclipse.tractusx.demandcapacitymgm.specification.model.CDRulesetRequest;
import eclipse.tractusx.demandcapacitymgm.specification.model.CDRulesetResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.CompanyRuleSetEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.repositories.CompanyRuleSetRepository;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.CompanyRuleSetService;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class CompanyRuleSetServiceImpl implements CompanyRuleSetService {

    private final CompanyRuleSetRepository repository;

    @Override
    public CDRulesetResponse getCompanyRuleSets(String companyID) {
        CDRulesetResponse response = new CDRulesetResponse();
        Optional<CompanyRuleSetEntity> entityOptional = repository.findById(UUID.fromString(companyID));

        if (entityOptional.isPresent()) {
            CompanyRuleSetEntity entity = entityOptional.get();
            response.setCompanyID(companyID);

            response.setPercentage(entity.getRuled_percentage());
        } else {
            log.error("CompanyRuleSetEntity not found for ID: {}", companyID);
            response.setCompanyID(companyID);
            response.setPercentage("");
        }
        return response;
    }

    @Override
    public CDRulesetResponse applyCompanyRuleSets(CDRulesetRequest request) {
        UUID cdUUID = UUID.fromString(request.getCompanyID());
        CompanyRuleSetEntity entity = repository.findById(cdUUID).orElse(new CompanyRuleSetEntity());

        entity.setCompanyID(cdUUID);
        entity.setRuled_percentage(request.getPercentages());

        CDRulesetResponse response = new CDRulesetResponse();
        if (entity.getRuled_percentage().equals("{}")) {
            repository.deleteByCompanyID(cdUUID);
            response.setCompanyID((cdUUID.toString()));
        } else {
            CompanyRuleSetEntity savedEntity = repository.save(entity);
            response.setCompanyID(savedEntity.getCompanyID().toString());
            response.setPercentage(savedEntity.getRuled_percentage());
        }

        return response;
    }
}
