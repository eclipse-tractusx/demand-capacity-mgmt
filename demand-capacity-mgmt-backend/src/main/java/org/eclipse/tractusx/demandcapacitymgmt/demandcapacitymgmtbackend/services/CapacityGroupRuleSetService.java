package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CGRulesetRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CGRulesetResponse;

public interface CapacityGroupRuleSetService {

     CGRulesetResponse getCapacityGroupRuleSets(String cgID);

     CGRulesetResponse applyCapacityGroupRuleSets(CGRulesetRequest request);
}
