package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.CdRulesetApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CDRulesetRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CDRulesetResponse;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CompanyRuleSetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class CompanyRuleSetController implements CdRulesetApi {

    private CompanyRuleSetService service;

    @Override
    public ResponseEntity<CDRulesetResponse> getCompanyRulesets(String cdID) throws Exception {
        return ResponseEntity.status(200).body(service.getCompanyRuleSets(cdID));
    }

    @Override
    public ResponseEntity<CDRulesetResponse> modifyCompanyRuleset(CDRulesetRequest cdRulesetRequest) throws Exception {
        return ResponseEntity.status(200).body(service.applyCompanyRuleSets(cdRulesetRequest));
    }
}
