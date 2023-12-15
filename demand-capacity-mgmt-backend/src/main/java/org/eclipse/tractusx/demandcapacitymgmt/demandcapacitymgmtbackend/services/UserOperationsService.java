package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserResponse;
import java.util.List;

public interface UserOperationsService {
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(String userID, UserRequest request);

    void deleteUser(String userId);

    List<UserResponse> fetchAllUsers();
}
