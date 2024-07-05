/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023, 2024 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * *******************************************************************************
 */
package org.eclipse.tractusx.demandcapacitymgm.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.eclipse.tractusx.demandcapacitymgm.backend.entities.enums.AlertThresholdType;
import org.eclipse.tractusx.demandcapacitymgm.backend.entities.enums.AlertsMonitoredObjects;

import java.util.List;
import java.util.UUID;

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

    @Column(name = "triggered_times")
    private int triggeredTimes;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY)
    @JoinColumn(name = "alert_id")
    private List<DedicatedAlertEntity> dedicatedAlerts;
}
