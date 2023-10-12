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

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.FavoriteEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.FavoriteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, UUID> {
    /* *
     *
     * We need @Transaction because we don't fetch the entity first
     * that way Hibernate entity manager won't be blocked because of missing entity manager
     * (since we don't fetch the entity at all we just send delete command)
     *
     *  */
    @Transactional
    void deleteByFavoriteIdAndId(@NonNull UUID favoriteId, @NonNull UUID id);

    FavoriteEntity findByFavoriteIdAndTypeAndId(@NonNull UUID favoriteId, @NonNull FavoriteType type, @NonNull UUID id);

    List<FavoriteEntity> findByType(FavoriteType type);
}
