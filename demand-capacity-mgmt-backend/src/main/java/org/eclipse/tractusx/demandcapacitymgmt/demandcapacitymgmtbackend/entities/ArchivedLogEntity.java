package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import java.sql.Timestamp;
import java.util.UUID;
import javax.persistence.*;

import io.micrometer.core.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "archived_log")
@Data
@Builder
public class ArchivedLogEntity {

    @Id
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "uuid", updatable = false, name = "id")
    private UUID id;

    @Column(name = "USER_ACCOUNT")
    private String userAccount;

    @Column(name = "TIME_CREATED")
    private Timestamp time_created;

    @Column(name = "EVENT_TYPE")
    private EventType eventType;

    @Column(columnDefinition = "uuid", updatable = false, name = "CAPACITY_GP_ID")
    @Nullable
    private UUID capacityGroupId;

    @Column(columnDefinition = "uuid", updatable = false, name = "MATERIAL_DEMAND_ID")
    @Nullable
    private UUID materialDemandId;


    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "OBJECT_TYPE")
    private EventObjectType objectType;

    @Column(name = "IS_FAVORITED")
    private Boolean isFavorited;

    public ArchivedLogEntity(
            UUID id,
            String userAccount,
            Timestamp time_created,
            EventType eventType,
            UUID capacityGroupId,
            UUID materialDemandId,
            String description,
            EventObjectType objectType,
            Boolean isFavorited
    ) {
        this.id = id;
        this.userAccount = userAccount;
        this.time_created = time_created;
        this.eventType = eventType;
        this.capacityGroupId = capacityGroupId;
        this.materialDemandId = materialDemandId;
        this.description = description;
        this.objectType = objectType;
        this.isFavorited = isFavorited;
    }

    public ArchivedLogEntity() {}
}
