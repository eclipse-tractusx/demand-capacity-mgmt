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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.util.*;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.StatusesEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkedCapacityGroupMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.StatusesRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.UserRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.DemandService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusesService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.StatusManager;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.WeekBasedStatusManager;
//import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.StatusManager2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Lazy
public class StatusesServiceImpl implements StatusesService {

    private final StatusesRepository statusesRepository;
    private final UserRepository userRepository;
    private LinkedCapacityGroupMaterialDemandRepository linkedCapacityGroupMaterialDemandRepository;

    List<WeekBasedCapacityGroupDtoResponse> oldWeekBasedCapacityGroupResponse;
    List<WeekBasedCapacityGroupDtoResponse> newWeekBasedCapacityGroupResponse;
    List<WeekBasedMaterialDemandResponseDto> newWeekBasedMaterialDemandResponse;
    List<WeekBasedMaterialDemandResponseDto> oldWeekBasedMaterialDemandResponse;

    List<CapacityGroupEntity> oldCapacityGroup;
    List<CapacityGroupEntity> newCapacityGroup;
    List<MaterialDemandEntity> newMaterialDemand;
    List<MaterialDemandEntity> oldMaterialDemand;

    @Autowired
    public StatusesServiceImpl(
        StatusesRepository statusesRepository,
        List<WeekBasedMaterialDemandResponseDto> oldWeekBasedMaterialDemandResponse,
        List<WeekBasedMaterialDemandResponseDto> newWeekBasedMaterialDemandResponse,
        List<WeekBasedCapacityGroupDtoResponse> oldWeekBasedCapacityGroupResponse,
        List<WeekBasedCapacityGroupDtoResponse> newWeekBasedCapacityGroupResponse,
        UserRepository userRepository
    ) {
        this.statusesRepository = statusesRepository;
        this.oldWeekBasedMaterialDemandResponse = oldWeekBasedMaterialDemandResponse;
        this.newWeekBasedMaterialDemandResponse = newWeekBasedMaterialDemandResponse;
        this.oldWeekBasedCapacityGroupResponse = oldWeekBasedCapacityGroupResponse;
        this.newWeekBasedCapacityGroupResponse = newWeekBasedCapacityGroupResponse;
        this.userRepository = userRepository;
    }

    public StatusesServiceImpl(
        List<CapacityGroupEntity> oldCapacityGroup,
        List<CapacityGroupEntity> newCapacityGroup,
        List<MaterialDemandEntity> oldMaterialDemand,
        List<MaterialDemandEntity> newMaterialDemand,
        StatusesRepository statusesRepository,
        LinkedCapacityGroupMaterialDemandRepository linkedCapacityGroupMaterialDemandRepository,
        UserRepository userRepository
    ) {
        this.statusesRepository = statusesRepository;
        this.oldCapacityGroup = oldCapacityGroup;
        this.newCapacityGroup = newCapacityGroup;
        this.oldMaterialDemand = oldMaterialDemand;
        this.newMaterialDemand = newMaterialDemand;
        this.linkedCapacityGroupMaterialDemandRepository = linkedCapacityGroupMaterialDemandRepository;
        this.userRepository = userRepository;
    }

    @Override
    public StatusesResponse postStatuses(StatusRequest statusRequest) {
        StatusesEntity statusesEntity = convertDtoToEntity(statusRequest);
        statusesRepository.save(statusesEntity);
        return convertStatusesResponseDto(statusesEntity);
    }

    private StatusesEntity convertDtoToEntity(StatusRequest statusRequest) {
        return StatusesEntity
            .builder()
            .id("")
            .todosCount(statusRequest.getTodos())
            .generalCount(statusRequest.getGeneral())
            .statusImprovementCount(statusRequest.getStatusImprovement())
            .statusDegradationCount(statusRequest.getStatusDegradation())
            .overAllStatusDegradationCount(statusRequest.getOverallStatusDegradation())
            .overAllGeneralCount(statusRequest.getOverallGeneral())
            .overAllStatusImprovementCount(statusRequest.getOverallStatusImprovement())
            .overAllTodosCount(statusRequest.getOverallTodos())
            .build();
    }

    @Override
    public StatusesResponse getAllStatuses() {
        List<StatusesEntity> statusesEntities = statusesRepository.findAll();
        if (statusesEntities.isEmpty()) {
            return null;
        }
        return statusesEntities.stream().map(this::convertStatusesResponseDto).toList().get(0);
    }

    private StatusesResponse convertStatusesResponseDto(StatusesEntity statusesEntity) {
        StatusesResponse responseDto = new StatusesResponse();
        responseDto.setTodos(statusesEntity.getTodosCount());
        responseDto.setGeneral(statusesEntity.getGeneralCount());
        responseDto.setStatusImprovement(statusesEntity.getStatusImprovementCount());
        responseDto.setStatusDegredation(statusesEntity.getStatusDegradationCount());
        responseDto.setOverallGeneral(statusesEntity.getOverAllGeneralCount());
        responseDto.setOverallTodos(statusesEntity.getOverAllTodosCount());
        responseDto.setOverallStatusImprovement(statusesEntity.getOverAllStatusImprovementCount());
        responseDto.setOverallStatusDegredation(statusesEntity.getOverAllStatusDegradationCount());
        return responseDto;
    }

    public void updateWeeklyBasedStatus() {
        WeekBasedStatusManager statusManager = new WeekBasedStatusManager();
        postStatuses(
            statusManager.retrieveUpdatedStatusRequest(
                oldWeekBasedCapacityGroupResponse,
                newWeekBasedCapacityGroupResponse,
                oldWeekBasedMaterialDemandResponse,
                newWeekBasedMaterialDemandResponse
            )
        );
    }

    public EventType updateStatus(boolean isMaterialDemand, String userID) {
        StatusManager statusManager = new StatusManager(linkedCapacityGroupMaterialDemandRepository, userRepository);
        postStatuses(
            statusManager.retrieveUpdatedStatusRequest(
                getAllStatuses(),
                oldCapacityGroup,
                newCapacityGroup,
                oldMaterialDemand,
                newMaterialDemand,
                userID
            )
        );
        EventType eventType = statusManager.getEventType();

        if (eventType == EventType.STATUS_REDUCTION || eventType == EventType.STATUS_IMPROVEMENT) {
            return eventType;
        }

        if (eventType != EventType.TODO && eventType != EventType.UN_LINKED && isMaterialDemand) {
            return EventType.LINKED;
        }
        if (!isMaterialDemand && eventType == EventType.TODO) {
            return EventType.GENERAL_EVENT;
        }
        return eventType;
    }
}
