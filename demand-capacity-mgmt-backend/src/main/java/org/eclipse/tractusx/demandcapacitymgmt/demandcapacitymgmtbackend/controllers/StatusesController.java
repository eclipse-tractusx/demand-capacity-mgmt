package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.StatusesApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusesResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.DemandService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class StatusesController implements StatusesApi {

    private final StatusesService statusesService;

    @Override
    public ResponseEntity<StatusesResponse> getStatuses() {
        return ResponseEntity.status(HttpStatus.OK).body(statusesService.getAllStatuses());
    }

    @Override
    public ResponseEntity<StatusesResponse> postStatus(StatusRequest statusRequest) {
        StatusesResponse responseDto = statusesService.postStatuses(statusRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @Override
    public ResponseEntity<StatusesResponse> updateStatusesById(String statusId, StatusRequest statusRequest)
    {
        return null;
    }
}
