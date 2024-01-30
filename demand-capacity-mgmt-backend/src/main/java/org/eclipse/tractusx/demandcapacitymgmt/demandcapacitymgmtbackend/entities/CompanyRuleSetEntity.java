package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company_ruleset")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRuleSetEntity {

    @Id
    @Column(columnDefinition = "uuid", updatable = true, name = "company_id")
    private UUID companyID;

    @Column(name = "ruled_percentage")
    private String ruled_percentage;
}
