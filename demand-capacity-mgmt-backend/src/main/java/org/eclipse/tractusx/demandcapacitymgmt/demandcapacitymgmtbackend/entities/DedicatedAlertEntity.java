package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;
import lombok.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;

@Entity
@Table(name = "dedicated_alerts")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DedicatedAlertEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, name = "id")
    private UUID id;

    @Column(name = "object_id")
    private UUID objectId;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private EventObjectType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private AlertEntity alertEntity;
}
