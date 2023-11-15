package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.UserOperationsApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserResponse;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.UserOperationsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class UserController implements UserOperationsApi {

    private final UserOperationsService service;

    @Override
    public ResponseEntity<List<UserResponse>> fetchAllUsers() throws Exception {
        return ResponseEntity.status(200).body(service.fetchAllUsers());
    }

    @Override
    public ResponseEntity<Void> updateAnUser(UserRequest userRequest) throws Exception {
        service.updateUser(userRequest);
        return ResponseEntity.status(201).build();
    }


}
