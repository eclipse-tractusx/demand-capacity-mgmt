package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "link_demand")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkDemandEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, name = "id")
    private UUID id;

    @Column(name = "material_number_customer")
    private String materialNumberCustomer;

    @Column(name = "material_number_supplier")
    private String materialNumberSupplier;

    @Column(name = "demand_category_id")
    private String demandCategoryId;

    @Column(name = "linked")
    private Boolean linked;

    @ManyToOne
    @JoinColumn(name = "week_based_material_demand_id")
    private WeekBasedMaterialDemandEntity weekBasedMaterialDemand;
}
