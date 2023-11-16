package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;

public interface UserOperationsService {
    void updateUser(UserRequest request);
}
