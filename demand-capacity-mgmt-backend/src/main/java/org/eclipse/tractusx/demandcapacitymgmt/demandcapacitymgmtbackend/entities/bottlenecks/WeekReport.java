/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.bottlenecks;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.DemandSeries;

@Entity
@Table(name = "week_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeekReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int week;

    @Column(nullable = false)
    private double delta;

    @Column(name = "max_capacity", nullable = false)
    private double maxCapacity;

    @Column(name = "act_capacity", nullable = false)
    private double actCapacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "month_report_id", nullable = false)
    private MonthReport monthReport;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demand_series_id", referencedColumnName = "id")
    private DemandSeries demandSeries;
}
