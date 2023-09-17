package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import java.sql.Timestamp;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventStatus;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.UserSpecificEventStatus;

@Entity
@Table(name = "logging_history")
@Data
@Builder
public class LoggingHistoryEntity {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, name = "id")
    private UUID id;

    @Column(name = "USER_ACCOUNT")
    private String userAccount;

    @Column(name = "TIME_CREATED")
    private Timestamp time_created;

    @Column(name = "EVENT_TYPE")
    private EventType eventType;

    @Column(name = "EVENT_STATUS")
    private EventStatus eventStatus;

    @Column(name = "USER_SPECIFIC_EVENT_STATUS")
    private UserSpecificEventStatus userSpecificEventStatus;

    @ManyToOne
    @JoinColumn(name = "CAPACITY_GP_ID", referencedColumnName = "id")
    private CapacityGroupEntity capacityGroupId;

    @ManyToOne
    @JoinColumn(name = "MATERIAL_DEMAND_ID", referencedColumnName = "id")
    private MaterialDemandEntity materialDemandId;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "OBJECT_TYPE")
    private EventObjectType objectType;

    @Column(name = "IS_FAVORITED")
    private Boolean isFavorited;

    public LoggingHistoryEntity(
        UUID id,
        String userAccount,
        Timestamp time_created,
        EventType eventType,
        EventStatus eventStatus,
        UserSpecificEventStatus userSpecificEventStatus,
        CapacityGroupEntity capacityGroupId,
        MaterialDemandEntity materialDemandId,
        String description,
        EventObjectType objectType,
        Boolean isFavorited
    ) {
        this.id = id;
        this.userAccount = userAccount;
        this.time_created = time_created;
        this.eventType = eventType;
        this.eventStatus = eventStatus;
        this.userSpecificEventStatus = userSpecificEventStatus;
        this.capacityGroupId = capacityGroupId;
        this.materialDemandId = materialDemandId;
        this.description = description;
        this.objectType = objectType;
        this.isFavorited = isFavorited;
    }

    public LoggingHistoryEntity() {}
}
