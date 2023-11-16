package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserResponse;
import java.util.List;

public interface UserOperationsService {
    void updateUser(UserRequest request);
    List<UserResponse> fetchAllUsers();
}
