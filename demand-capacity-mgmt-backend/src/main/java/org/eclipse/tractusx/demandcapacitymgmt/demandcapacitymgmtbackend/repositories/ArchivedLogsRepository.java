package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories;

import java.util.UUID;

import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.ArchivedLogEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.DemandCategoryEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LoggingHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchivedLogsRepository extends JpaRepository<ArchivedLogEntity, UUID> {}
