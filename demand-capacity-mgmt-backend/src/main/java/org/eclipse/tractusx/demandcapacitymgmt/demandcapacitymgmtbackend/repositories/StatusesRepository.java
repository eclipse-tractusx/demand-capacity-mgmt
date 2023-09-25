package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories;

import java.util.UUID;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.StatusesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusesRepository extends JpaRepository<StatusesEntity, UUID> {}
