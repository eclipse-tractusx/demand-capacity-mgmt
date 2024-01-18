package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories;

import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupRuleSetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CapacityGroupRuleSetRepository extends JpaRepository<CapacityGroupRuleSetEntity, UUID> {
    Optional<CapacityGroupRuleSetEntity> findByCgID(UUID cgID);
}
