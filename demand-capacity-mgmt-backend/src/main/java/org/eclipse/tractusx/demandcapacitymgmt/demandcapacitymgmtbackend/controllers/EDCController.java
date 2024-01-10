package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.EdcApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.AccessTokenResponse;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.EDCService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class EDCController implements EdcApi {

    private final EDCService edcService;

    @Override
    public ResponseEntity<AccessTokenResponse> getAccessToken() throws Exception {
        return ResponseEntity.ok(edcService.getAccessToken().block());
    }
}
