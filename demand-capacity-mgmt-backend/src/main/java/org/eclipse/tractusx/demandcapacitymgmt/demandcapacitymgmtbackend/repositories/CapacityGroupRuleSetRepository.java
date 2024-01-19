package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories;

import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupRuleSetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CapacityGroupRuleSetRepository extends JpaRepository<CapacityGroupRuleSetEntity, UUID> {
    @Transactional
    @Modifying
    @Query("delete from CapacityGroupRuleSetEntity c where c.cgID = ?1")
    int deleteByCgID(@NonNull UUID cgID);
    Optional<CapacityGroupRuleSetEntity> findByCgID(UUID cgID);
}
