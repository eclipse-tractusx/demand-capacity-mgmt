package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import jakarta.persistence.*;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "capacity_group_ruleset")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapacityGroupRuleSetEntity {

    @Id
    @Column(columnDefinition = "uuid", updatable = true, name = "capacity_group_id")
    private UUID cgID;

    @Column(name = "ruled_percentage")
    private String ruled_percentage;
}
