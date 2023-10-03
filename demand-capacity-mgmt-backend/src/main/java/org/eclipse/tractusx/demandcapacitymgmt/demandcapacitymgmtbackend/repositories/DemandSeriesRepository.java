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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories;

import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.DemandSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.UUID;

public interface DemandSeriesRepository extends JpaRepository<DemandSeries, UUID> {
    @Query("""
            select d from DemandSeries d
            where d.customerLocation.id = ?1 and d.demandCategory.id = ?2 and d.materialDemand.materialNumberCustomer = ?3""")
    List<DemandSeries> ByCategoryIDCustomerIDMaterialNrCustomer(@NonNull UUID id, @NonNull UUID id1, @NonNull String materialNumberCustomer);

    @Query("""
        select d from DemandSeries d
        where d.capacityGroupId = ?1 and d.materialDemand.id = ?2
    """)
    DemandSeries fetchByCGIDandMatID(@NonNull UUID id, @NonNull UUID id2);
}