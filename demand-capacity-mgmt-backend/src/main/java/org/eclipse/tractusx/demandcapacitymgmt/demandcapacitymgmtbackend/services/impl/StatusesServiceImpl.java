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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusesResponse;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.StatusesEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.StatusesRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusesService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Lazy
@RequiredArgsConstructor
@Service
@Slf4j
public class StatusesServiceImpl implements StatusesService {

    private final StatusesRepository statusesRepository;

    private StatusesEntity convertDtoToEntity(StatusRequest statusRequest, String userID) {
        return StatusesEntity
            .builder()
            .userID(UUID.fromString(userID))
            .todosCount(statusRequest.getTodos())
            .generalCount(statusRequest.getGeneral())
            .statusImprovementCount(statusRequest.getStatusImprovement())
            .statusDegradationCount(statusRequest.getStatusDegradation())
            .build();
    }

    private StatusesResponse convertStatusesResponseDto(StatusesEntity statusesEntity) {
        StatusesResponse responseDto = new StatusesResponse();
        responseDto.setTodos(statusesEntity.getTodosCount());
        responseDto.setGeneral(statusesEntity.getGeneralCount());
        responseDto.setStatusImprovement(statusesEntity.getStatusImprovementCount());
        responseDto.setStatusDegredation(statusesEntity.getStatusDegradationCount());
        return responseDto;
    }

    @Override
    public StatusesResponse postStatuses(StatusRequest statusRequest, String userID) {
        UUID uuid = UUID.fromString(userID);
        StatusesEntity existingEntity = statusesRepository.findByUserID(uuid).orElse(null);
        StatusesEntity statusesEntity = convertDtoToEntity(statusRequest, userID);
        if (existingEntity != null) {
            statusesEntity.setId(existingEntity.getId());
        }
        statusesRepository.save(statusesEntity);
        return convertStatusesResponseDto(statusesEntity);
    }

    @Override
    public StatusesResponse getAllStatuses(String userID) {
        Optional<StatusesEntity> entity = statusesRepository.findByUserID(UUID.fromString(userID));
        return entity.map(this::convertStatusesResponseDto).orElse(null);
    }

    @Override
    public void updateStatus(StatusRequest statusRequest, String userID) {
        Optional<StatusesEntity> entity = statusesRepository.findByUserID(UUID.fromString(userID));
        if (entity.isPresent()) {
            StatusesEntity statusesEntity = convertDtoToEntity(statusRequest, userID);
            statusesEntity.setId(entity.get().getId());
            statusesRepository.save(statusesEntity);
        }
    }

    @Override
    public void addOrSubtractTodos(boolean add, String userID) {
        //TODO REMOVE DEPRECATED METHOD, IMPLEMENTED NOW WITH STATUSMANAGER CALCULATETODOS
    }
}
