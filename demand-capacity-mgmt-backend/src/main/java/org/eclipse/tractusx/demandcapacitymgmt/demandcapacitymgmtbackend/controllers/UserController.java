package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.UserOperationsApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CompanyDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserResponse;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.UserOperationsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class UserController implements UserOperationsApi {

    private final UserOperationsService service;

    @Override
    public ResponseEntity<Void> deleteUsersById(String userId) throws Exception {
        service.deleteUser(userId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public ResponseEntity<List<UserResponse>> fetchAllUsers() throws Exception {
        return ResponseEntity.status(200).body(service.fetchAllUsers());
    }

    @Override
    public ResponseEntity<UserResponse> postUser(UserRequest userRequest) throws Exception {
        UserResponse user = service.createUser(userRequest);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @Override
    public ResponseEntity<UserResponse> updateUserById(String userId, UserRequest userRequest) throws Exception {
        UserResponse user = service.updateUser(userId, userRequest);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

}
