package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.RulesApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.RuleRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.RuleResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.RulesetService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UserUtil;
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
