package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupRequest;

public interface CapacityGroupService {
    void createCapacityGroup(CapacityGroupRequest capacityGroupRequest);
}
