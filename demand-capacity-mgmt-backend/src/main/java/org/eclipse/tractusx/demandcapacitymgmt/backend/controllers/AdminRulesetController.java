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

package org.eclipse.tractusx.demandcapacitymgmt.backend.controllers;

import eclipse.tractusx.demandcapacitymgm.specification.api.RulesApi;
import eclipse.tractusx.demandcapacitymgm.specification.model.AddRuleRequest;
import eclipse.tractusx.demandcapacitymgm.specification.model.RuleRequest;
import eclipse.tractusx.demandcapacitymgm.specification.model.RuleResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.RulesetService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.UserUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@AllArgsConstructor
public class AdminRulesetController implements RulesApi {

    private HttpServletRequest request;

    private RulesetService rulesetService;

    @Override
    public ResponseEntity<Void> addRule(AddRuleRequest addRuleRequest) throws Exception {
        rulesetService.addRule(addRuleRequest);
        return ResponseEntity.status(200).build();
    }

    @Override
    public ResponseEntity<Void> deleteRules(List<RuleRequest> requestBody) throws Exception {
        rulesetService.deleteRules(requestBody);
        return ResponseEntity.status(200).build();
    }

    @Override
    public ResponseEntity<List<RuleResponse>> getAllEnabledRules() throws Exception {
        return ResponseEntity.status(200).body(rulesetService.getAllEnabledRules());
    }

    @Override
    public ResponseEntity<List<RuleResponse>> getAllRules() throws Exception {
        if (Objects.equals(UserUtil.getUserRole(request), Role.ADMIN)) {
            return ResponseEntity.status(200).body(rulesetService.getAllRules());
        } else return ResponseEntity.status(200).body(rulesetService.getAllEnabledRules());
    }

    @Override
    public ResponseEntity<RuleResponse> getRule(Integer id) throws Exception {
        if (Objects.equals(UserUtil.getUserRole(request), Role.ADMIN)) {
            return ResponseEntity.status(200).body(rulesetService.getRule(id));
        } else return ResponseEntity.status(401).build();
    }

    @Override
    public ResponseEntity<Void> updateRules(List<RuleRequest> ruleRequest) throws Exception {
        if (Objects.equals(UserUtil.getUserRole(request), Role.ADMIN)) {
            rulesetService.updateRule(ruleRequest);
            return ResponseEntity.status(202).build();
        } else return ResponseEntity.status(401).build();
    }
}
