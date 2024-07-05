/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023, 2024 Contributors to the Eclipse Foundation
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

package org.eclipse.tractusx.demandcapacitymgmt.backend.repositories;

import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.FavoriteEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.FavoriteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, UUID> {
    @Transactional
    @Modifying
    @Query("delete from FavoriteEntity f where f.userID = ?1 and f.favoriteId = ?2")
    void deleteFavorite(@NonNull UUID userID, @NonNull UUID favoriteId);

    List<FavoriteEntity> findByUserIDAndType(UUID userID, FavoriteType type);
    FavoriteEntity findByUserIDAndId(UUID userID, int id);
    List<FavoriteEntity> findByUserID(@NonNull UUID userID);
    List<FavoriteEntity> findByType(FavoriteType type);
}
