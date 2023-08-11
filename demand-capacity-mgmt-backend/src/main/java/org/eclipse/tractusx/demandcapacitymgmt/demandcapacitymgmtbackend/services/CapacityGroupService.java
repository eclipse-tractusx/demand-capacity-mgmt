package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupDefaultViewResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.MaterialDemandResponse;
import java.util.List;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.CapacityGroupStatus;

public interface CapacityGroupService {
    CapacityGroupResponse createCapacityGroup(CapacityGroupRequest capacityGroupRequest);

    CapacityGroupResponse getCapacityGroupById(String CapacityGroupId);

    List<CapacityGroupEntity> getAllByStatus(CapacityGroupStatus status);

    List<CapacityGroupDefaultViewResponse> getAll();
}
