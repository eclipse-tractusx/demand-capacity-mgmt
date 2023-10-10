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

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.util.List;
import java.util.UUID;
import javax.persistence.*;
import lombok.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.converters.ListToStringConverter;

@Entity
@Table(name = "demand_series")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class DemandSeries {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, name = "id")
    private UUID id;

    @Column(name = "capacity_group_id")
    private String capacityGroupId;

    @OneToOne
    @JoinColumn(name = "customer_location_id", referencedColumnName = "ID")
    private CompanyEntity customerLocation;

    @Column(name = "expected_supplier_location_id")
    @Convert(converter = ListToStringConverter.class)
    private List<String> expectedSupplierLocation;

    @OneToOne
    @JoinColumn(name = "demand_category_code_id", referencedColumnName = "ID")
    private DemandCategoryEntity demandCategory;

    @OneToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY)
    @JoinColumn(name = "demand_series_id")
    private List<DemandSeriesValues> demandSeriesValues;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    private MaterialDemandEntity materialDemand;
}
