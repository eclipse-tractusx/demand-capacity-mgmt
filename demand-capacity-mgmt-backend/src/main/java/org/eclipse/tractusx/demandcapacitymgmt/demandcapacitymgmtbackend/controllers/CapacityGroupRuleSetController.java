package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.CgRulesetApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CGRulesetRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CGRulesetResponse;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupRuleSetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class CapacityGroupRuleSetController implements CgRulesetApi {

    private CapacityGroupRuleSetService service;

    @Override
    public ResponseEntity<CGRulesetResponse> getCapacityGroupRulesets(String cgID) throws Exception {
        return ResponseEntity.status(200).body(service.getCapacityGroupRuleSets(cgID));
    }

    @Override
    public ResponseEntity<CGRulesetResponse> modifyCapacityGroupRuleset(CGRulesetRequest cgRulesetRequest)
        throws Exception {
        return ResponseEntity.status(200).body(service.applyCapacityGroupRuleSets(cgRulesetRequest));
    }
}
