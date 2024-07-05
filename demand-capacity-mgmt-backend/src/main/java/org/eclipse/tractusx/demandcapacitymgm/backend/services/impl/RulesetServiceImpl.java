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

package org.eclipse.tractusx.demandcapacitymgm.backend.services.impl;

import eclipse.tractusx.demandcapacitymgm.specification.model.AddRuleRequest;
import eclipse.tractusx.demandcapacitymgm.specification.model.RuleRequest;
import eclipse.tractusx.demandcapacitymgm.specification.model.RuleResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgm.backend.entities.Rule;
import org.eclipse.tractusx.demandcapacitymgm.backend.repositories.RulesetRepository;
import org.eclipse.tractusx.demandcapacitymgm.backend.services.RulesetService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class RulesetServiceImpl implements RulesetService {

    private final RulesetRepository rulesetRepository;

    @Override
    public List<RuleResponse> getAllRules() {
        List<RuleResponse> rules = new ArrayList<>();
        List<Rule> rulesEnts;
        try {
            rulesEnts = rulesetRepository.findAll();
            for (Rule rule : rulesEnts) {
                rules.add(convertToDto(rule));
            }
        } catch (Exception e) {
            log.debug("Failed to fetch rules");
        }
        return rules;
    }

    @Override
    public List<RuleResponse> getAllEnabledRules() {
        List<RuleResponse> rules = new ArrayList<>();
        List<Rule> rulesEnts;
        try {
            rulesEnts = rulesetRepository.findAll();
            for (Rule rule : rulesEnts) {
                if (rule.isEnabled()) {
                    rules.add(convertToDto(rule));
                }
            }
        } catch (Exception e) {
            log.debug("Failed to fetch rules");
        }
        return rules;
    }

    @Override
    public RuleResponse getRule(Integer id) {
        Optional<Rule> rule = rulesetRepository.findById(id);
        return rule.map(this::convertToDto).orElse(null);
    }

    @Override
    public void updateRule(List<RuleRequest> rulesRequest) {
        for (RuleRequest ruleRequest : rulesRequest) {
            Optional<Rule> ruleEnt = rulesetRepository.findById(ruleRequest.getId());
            if (ruleEnt.isPresent()) {
                Rule rule = ruleEnt.get();
                rule.setEnabled(ruleRequest.getEnabled());
                rulesetRepository.save(rule);
            }
        }
    }

    @Override
    public void deleteRules(List<RuleRequest> rules) {
        for (RuleRequest ruleRequest : rules) {
            Optional<Rule> ruleEnt = rulesetRepository.findById(ruleRequest.getId());
            ruleEnt.ifPresent(rulesetRepository::delete);
        }
    }

    @Override
    public void addRule(AddRuleRequest rule) {
        // Find the last rule in the database
        Rule lastRule = rulesetRepository.findTopByOrderByIdDesc();

        // Determine the new id
        int newId = 1; // Default if no rules exist yet
        if (lastRule != null) {
            newId = lastRule.getId() + 1;
        }

        // Create the new Rule entity with the determined id
        Rule ruleEntity = new Rule();
        ruleEntity.setId(newId);
        ruleEntity.setPercentage(rule.getPercentage());
        ruleEntity.setEnabled(true);

        // Save the new rule to the database
        rulesetRepository.save(ruleEntity);
    }

    private RuleResponse convertToDto(Rule ruleEnt) {
        RuleResponse rule = new RuleResponse();
        rule.setId(ruleEnt.getId());
        rule.setEnabled(ruleEnt.isEnabled());
        rule.setPercentage(ruleEnt.getPercentage());
        return rule;
    }
}
