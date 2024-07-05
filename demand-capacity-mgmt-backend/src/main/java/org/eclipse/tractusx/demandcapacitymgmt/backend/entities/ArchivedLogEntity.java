/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023, 2024 Contributors to the Eclipse Foundation
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

package org.eclipse.tractusx.demandcapacitymgmt.backend.entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.EventType;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "archived_log")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArchivedLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "log_id")
    @Nullable
    private UUID logID;

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
}
