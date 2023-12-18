package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.RuleRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.RuleResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface RulesetService {

    List<RuleResponse> getAllRules();

    RuleResponse getRule(Integer id);

    void updateRule(RuleRequest id);
}
