/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *    See the NOTICE file(s) distributed with this work for additional
 *    information regarding copyright ownership.
 *
 *    This program and the accompanying materials are made available under the
 *    terms of the Apache License, Version 2.0 which is available at
 *    https://www.apache.org/licenses/LICENSE-2.0.
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *    License for the specific language governing permissions and limitations
 *    under the License.
 *
 *    SPDX-License-Identifier: Apache-2.0
 *    ********************************************************************************
 */

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import io.micrometer.core.lang.Nullable;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.UUID;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

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
        int id,
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
