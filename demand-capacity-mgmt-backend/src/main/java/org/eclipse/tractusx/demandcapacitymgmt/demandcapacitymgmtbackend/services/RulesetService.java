package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.AddRuleRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.RuleRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.RuleResponse;
import java.util.List;

public interface RulesetService {
    List<RuleResponse> getAllRules();

    List<RuleResponse> getAllEnabledRules();

    RuleResponse getRule(Integer id);

    void updateRule(List<RuleRequest> rules);

    void deleteRules(List<RuleRequest> rules);

    void addRule(AddRuleRequest rule);
}
