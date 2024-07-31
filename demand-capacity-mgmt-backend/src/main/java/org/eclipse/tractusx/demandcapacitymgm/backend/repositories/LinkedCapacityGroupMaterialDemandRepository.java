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

package org.eclipse.tractusx.demandcapacitymgm.backend.repositories;

import jakarta.transaction.Transactional;
import org.eclipse.tractusx.demandcapacitymgm.backend.entities.LinkedCapacityGroupMaterialDemandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface LinkedCapacityGroupMaterialDemandRepository
    extends JpaRepository<LinkedCapacityGroupMaterialDemandEntity, UUID> {
    LinkedCapacityGroupMaterialDemandEntity findByMaterialDemandID(UUID materialDemandID);
    List<LinkedCapacityGroupMaterialDemandEntity> findByCapacityGroupID(@NonNull UUID capacityGroupID);

    @Query("select count(l) from LinkedCapacityGroupMaterialDemandEntity l where l.materialDemandID = ?1")
    long countLinkedDemands(UUID materialDemandID);

    @Transactional
    void deleteByCapacityGroupIDAndMaterialDemandID(UUID capacityGroup, UUID materialDemandID);

    @Transactional
    void deleteByMaterialDemandID(UUID materialDemandID);

    List<LinkedCapacityGroupMaterialDemandEntity> findLinkedCapacityGroupMaterialDemandEntitiesByCapacityGroupID(
        UUID capacityGroup
    );

    BigDecimal countByCapacityGroupID(UUID id);
}
