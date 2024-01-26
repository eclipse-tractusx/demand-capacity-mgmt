package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Cacheable(false)
@Table(name = "admin_ruleset")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Rule {

    @Id
    private int id;

    @Column(name = "percentage")
    private int percentage;

    @Column(name = "enabled")
    private boolean enabled;
}
