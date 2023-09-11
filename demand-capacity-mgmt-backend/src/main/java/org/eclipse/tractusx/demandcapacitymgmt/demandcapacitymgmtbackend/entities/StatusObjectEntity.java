package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import java.util.List;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.converters.ListToStringConverter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
@Table(name = "status_object")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusObjectEntity {

    @Id
    //    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "count")
    private int count;

    @Convert(converter = ListToStringConverter.class)
    @Column(name = "material_demand_ids")
    private List<String> materialDemandIds;

    @Convert(converter = ListToStringConverter.class)
    @Column(name = "capacity_group_ids")
    private List<String> capacityGroupIds;
}
