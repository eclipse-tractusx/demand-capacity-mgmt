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

package org.eclipse.tractusx.demandcapacitymgmt.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "link_capacitygroup_demandseries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkedCapacityGroupMaterialDemandEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, name = "id")
    private UUID id;

    @Column(columnDefinition = "uuid", updatable = false, name = "demand_category_code_id")
    private UUID demandCategoryCodeID;

    @Column(columnDefinition = "uuid", updatable = false, name = "customer_id")
    private UUID customerID;

    @Column(name = "material_number_customer")
    private String materialNumberCustomer;

    @Column(name = "material_number_supplier")
    private String materialNumberSupplier;

    @Column(columnDefinition = "uuid", updatable = false, name = "capacity_group_id", nullable = false)
    private UUID capacityGroupID;

    @Column(columnDefinition = "uuid", updatable = false, name = "material_demand_id", nullable = false)
    private UUID materialDemandID;
}
