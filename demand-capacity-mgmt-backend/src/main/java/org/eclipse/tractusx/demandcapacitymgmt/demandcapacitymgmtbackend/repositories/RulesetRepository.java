package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories;

import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.Rule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RulesetRepository extends JpaRepository<Rule, Integer> {
}
