package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.UserOperationsApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.UserOperationsService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UserUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class UserController implements UserOperationsApi {

    private final UserOperationsService service;
    private HttpServletRequest request;

    @Override
    public ResponseEntity<Void> updateAnUser(UserRequest userRequest) throws Exception {
        service.updateUser(userRequest);
        return ResponseEntity.status(201).build();
    }
}
