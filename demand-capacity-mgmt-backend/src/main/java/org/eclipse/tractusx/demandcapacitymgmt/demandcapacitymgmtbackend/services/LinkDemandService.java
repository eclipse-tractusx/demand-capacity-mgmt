package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import java.util.List;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.WeekBasedMaterialDemandEntity;

public interface LinkDemandService {
    public void createLinkDemands(List<WeekBasedMaterialDemandEntity> weekBasedMaterialDemandEntities);
}
