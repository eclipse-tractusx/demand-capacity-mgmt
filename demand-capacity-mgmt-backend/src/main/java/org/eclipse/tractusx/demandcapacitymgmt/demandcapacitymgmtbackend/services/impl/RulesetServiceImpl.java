package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.RuleRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.RuleResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.Rule;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.RulesetRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.RulesetService;
import org.springframework.stereotype.Service;

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

    private RuleResponse convertToDto(Rule ruleEnt) {
        RuleResponse rule = new RuleResponse();
        rule.setId(ruleEnt.getId());
        rule.setEnabled(ruleEnt.isEnabled());
        rule.setPercentage(ruleEnt.getPercentage());
        return rule;
    }
}
