package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories;

import java.util.Optional;
import java.util.UUID;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CompanyRuleSetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CompanyRuleSetRepository extends JpaRepository<CompanyRuleSetEntity, UUID> {
    @Transactional
    @Modifying
    @Query("delete from CompanyRuleSetEntity c where c.companyID = ?1")
    int deleteByCompanyID(@NonNull UUID companyID);

    Optional<CompanyRuleSetEntity> findByCompanyID(UUID companyID);
}
