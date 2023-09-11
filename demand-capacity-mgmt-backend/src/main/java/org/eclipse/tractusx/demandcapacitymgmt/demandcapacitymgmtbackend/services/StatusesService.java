package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.MaterialDemandRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.MaterialDemandResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusesResponse;
import java.util.List;
import java.util.UUID;

public interface StatusesService {
    StatusesResponse postStatuses(StatusRequest statusRequest);
    StatusesResponse getAllStatuses();

}
