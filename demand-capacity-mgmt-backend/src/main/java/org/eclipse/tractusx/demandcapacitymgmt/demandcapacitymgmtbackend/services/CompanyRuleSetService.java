package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CDRulesetRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CDRulesetResponse;

public interface CompanyRuleSetService {
    CDRulesetResponse getCompanyRuleSets(String companyID);

    CDRulesetResponse applyCompanyRuleSets(CDRulesetRequest request);
}
