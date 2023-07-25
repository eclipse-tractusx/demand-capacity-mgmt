/*
 * *******************************************************************************
 *   Copyright (c) 2023 BMW AG
 *   Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *   See the NOTICE file(s) distributed with this work for additional
 *   information regarding copyright ownership.
 *
 *   This program and the accompanying materials are made available under the
 *   terms of the Apache License, Version 2.0 which is available at
 *   https://www.apache.org/licenses/LICENSE-2.0.
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *   WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *   License for the specific language governing permissions and limitations
 *   under the License.
 *
 *   SPDX-License-Identifier: Apache-2.0
 *   ********************************************************************************
 *
 */

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import java.time.LocalDateTime;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
@Table(name = "capacity_time_series")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapacityTimeSeries {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, name = "id")
    private UUID id;

    @Column(name = "calendar_week", nullable = false)
    private LocalDateTime calendarWeek;

    @Column(name = "actual_capacity", nullable = false)
    private Double actualCapacity;

    @Column(name = "maximum_capacity", nullable = false)
    private Double maximumCapacity;

    @ManyToOne
    @JoinColumn(name = "capacity_group_id")
    private CapacityGroupEntity capacityGroupEntity;
}
