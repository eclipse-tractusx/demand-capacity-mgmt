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

package org.eclipse.tractusx.demandcapacitymgmt.backend.services.impl;

import eclipse.tractusx.demandcapacitymgmt.specification.model.CGRulesetRequest;
import eclipse.tractusx.demandcapacitymgmt.specification.model.CGRulesetResponse;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.CapacityGroupRuleSetEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.repositories.CapacityGroupRuleSetRepository;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.CapacityGroupRuleSetService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class CapacityGroupRuleSetServiceImpl implements CapacityGroupRuleSetService {

    private final CapacityGroupRuleSetRepository repository;

    @Override
    public CGRulesetResponse getCapacityGroupRuleSets(String cgID) {
        CGRulesetResponse response = new CGRulesetResponse();
        Optional<CapacityGroupRuleSetEntity> entityOptional = repository.findById(UUID.fromString(cgID));

        if (entityOptional.isPresent()) {
            CapacityGroupRuleSetEntity entity = entityOptional.get();
            response.setCgID(cgID);

            response.setPercentage(entity.getRuled_percentage());
        } else {
            log.error("CapacityGroupRuleSetEntity not found for ID: {}", cgID);
            response.setCgID(cgID);
            response.setPercentage("");
        }
        return response;
    }

    @Override
    public CGRulesetResponse applyCapacityGroupRuleSets(CGRulesetRequest request) {
        UUID cgUUID = UUID.fromString(request.getCgID());
        CapacityGroupRuleSetEntity entity = repository.findById(cgUUID).orElse(new CapacityGroupRuleSetEntity());

        entity.setCgID(cgUUID);
        entity.setRuled_percentage(request.getPercentages());
        CGRulesetResponse response = new CGRulesetResponse();
        if (entity.getRuled_percentage().equals("{}")) {
            repository.deleteByCgID(cgUUID);
            response.setCgID(cgUUID.toString());
        } else {
            CapacityGroupRuleSetEntity savedEntity = repository.save(entity);
            response.setCgID(savedEntity.getCgID().toString());
            response.setPercentage(savedEntity.getRuled_percentage());
        }

        return response;
    }
}
