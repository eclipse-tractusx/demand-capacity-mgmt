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

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "capacity_group")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapacityGroupEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, name = "id")
    private UUID id;

    @Column(name = "capacity_group_name")
    private String capacityGroupName;

    @Column(name = "defaultactualcapacity")
    private float defaultActualCapacity;

    @Column(name = "defaultmaximumcapacity")
    private float defaultMaximumCapacity;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @OneToOne
    @JoinColumn(name = "customer", referencedColumnName = "ID")
    private CompanyEntity customerId;

    @OneToOne
    @JoinColumn(name = "supplier", referencedColumnName = "ID")
    private CompanyEntity supplierId;

    @OneToMany(mappedBy = "capacityGroup", cascade = CascadeType.ALL)
    private List<LinkedCapacityGroupMaterialDemandEntity> linkedMaterialDemands = new ArrayList<>();

}
