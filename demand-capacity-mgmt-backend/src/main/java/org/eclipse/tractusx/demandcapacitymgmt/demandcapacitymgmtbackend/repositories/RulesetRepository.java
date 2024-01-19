package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories;

import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.Rule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RulesetRepository extends JpaRepository<Rule, Integer> {
    Rule findTopByOrderByIdDesc();
}
