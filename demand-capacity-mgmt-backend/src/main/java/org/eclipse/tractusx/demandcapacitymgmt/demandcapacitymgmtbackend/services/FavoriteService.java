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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.FavoriteRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.FavoriteResponse;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.FavoriteType;

import java.util.List;
import java.util.UUID;

public interface FavoriteService {
    List<FavoriteResponse> getAllFavorites();
    List<FavoriteResponse> getAllFavoritesByType(String type);
    FavoriteResponse createFavorite(FavoriteRequest favoriteRequest);
    FavoriteResponse updateFavorite(UUID id, FavoriteType type, FavoriteRequest favoriteRequest);
    void deleteFavorite(UUID id);
}
