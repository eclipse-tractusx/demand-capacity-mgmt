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

package org.eclipse.tractusx.demandcapacitymgmt.backend.repositories;

import jakarta.persistence.Cacheable;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.MaterialDemandStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@Cacheable(false)
public interface MaterialDemandRepository extends JpaRepository<MaterialDemandEntity, UUID> {
    List<MaterialDemandEntity> findBySupplierId_Id(UUID id);

    @Query("select m from MaterialDemandEntity m where m.customerId.id = ?1")
    List<MaterialDemandEntity> findByCustomerId_Id(UUID id);

    List<MaterialDemandEntity> findAllByStatus(MaterialDemandStatus status);

    @Query(
        "SELECT DISTINCT md FROM MaterialDemandEntity md " +
        "JOIN FETCH md.demandSeries ds JOIN FETCH ds.demandCategory dc " +
        "WHERE md.materialNumberCustomer = :materialNumberCustomer " +
        "AND ds.customerLocation.bpn = :customerLocationBpn " +
        "AND dc.demandCategoryCode = :demandCategoryCode"
    )
    List<MaterialDemandEntity> findAllByMaterialNumberCustomerAndDemandSeriesCustomerLocationAndDemandCategory(
        String materialNumberCustomer,
        String customerLocationBpn,
        String demandCategoryCode
    );
}
