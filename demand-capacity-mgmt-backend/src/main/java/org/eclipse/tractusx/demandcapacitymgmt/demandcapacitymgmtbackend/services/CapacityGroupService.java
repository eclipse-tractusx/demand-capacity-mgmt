package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacityGroupRequest;
import java.util.List;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.CapacityGroupStatus;

public interface CapacityGroupService {
    void createCapacityGroup(CapacityGroupRequest capacityGroupRequest);

    List<CapacityGroupEntity> getAllByStatus(CapacityGroupStatus status);
}
