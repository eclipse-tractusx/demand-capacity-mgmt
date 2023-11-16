package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;
import lombok.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.AlertThresholdType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.AlertsMonitoredObjects;

@Entity
@Table(name = "alerts")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, name = "id")
    private UUID id;

    @Column(name = "user_id")
    private UUID userID;

    @Column(name = "alert_name")
    private String alertName;

    @Column(name = "monitored_objects")
    @Enumerated(EnumType.STRING)
    private AlertsMonitoredObjects monitoredObjects;

    @Column(name = "created")
    private String created;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private AlertThresholdType type;

    @Column(name = "threshold")
    private double threshold;

    @Column(name = "description")
    private String description;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY)
    @JoinColumn(name = "alert_id")
    private List<DedicatedAlertEntity> dedicatedAlerts;
}
