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

import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DEMAND")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemandEntity {

    @Id
    @Column(name = "ID", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "COMPANY_ID", referencedColumnName = "ID")
    private CompanyEntity company;

    @Column(name = "REQUIRED_VALUE")
    private Double requiredValue;

    @Column(name = "DELIVERED_VALUE")
    private Double deliveredValue;

    @Column(name = "MAXIMUM_VALUE")
    private Double maximumValue;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DEMAND_CATEGORY")
    private String demandCategory;

    @Column(name = "START_DATE", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "END_DATE", nullable = false)
    private LocalDateTime endDate;

    @ManyToOne
    @JoinColumn(name = "UNIT_MEASURE_ID", referencedColumnName = "ID")
    private UnitMeasureEntity unitMeasure;
}
