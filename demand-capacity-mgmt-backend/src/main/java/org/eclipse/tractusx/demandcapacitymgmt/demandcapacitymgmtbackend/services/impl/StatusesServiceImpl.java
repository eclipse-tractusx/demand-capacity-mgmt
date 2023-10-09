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
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.StatusesEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.StatusColor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.models.MaterialCapacityQuantity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.StatusesRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusesService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.DataConverterUtil;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.StatusManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Lazy
public class StatusesServiceImpl implements StatusesService {
    private final StatusesRepository statusesRepository;
    List<WeekBasedCapacityGroupDtoResponse> oldWeekBasedCapacityGroupResponse;
    List<WeekBasedCapacityGroupDtoResponse> newWeekBasedCapacityGroupResponse;
    List<WeekBasedMaterialDemandResponseDto> newWeekBasedMaterialDemandResponse;
    List<WeekBasedMaterialDemandResponseDto> oldWeekBasedMaterialDemandResponse;

    public StatusesServiceImpl(
        StatusesRepository statusesRepository,
        List<WeekBasedMaterialDemandResponseDto> oldWeekBasedMaterialDemandResponse,
        List<WeekBasedMaterialDemandResponseDto> newWeekBasedMaterialDemandResponse,
        List<WeekBasedCapacityGroupDtoResponse> oldWeekBasedCapacityGroupResponse,
        List<WeekBasedCapacityGroupDtoResponse> newWeekBasedCapacityGroupResponse
    ) {
        this.statusesRepository = statusesRepository;
        this.oldWeekBasedMaterialDemandResponse = oldWeekBasedMaterialDemandResponse;
        this.newWeekBasedMaterialDemandResponse = newWeekBasedMaterialDemandResponse;
        this.oldWeekBasedCapacityGroupResponse = oldWeekBasedCapacityGroupResponse;
        this.newWeekBasedCapacityGroupResponse = newWeekBasedCapacityGroupResponse;
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
            return new StatusesResponse();
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

    // TODO : Saja Add these methods
    //    private EventType getStatusForMaterialDemand(){
    //        EventType eventType;
    //        if(eventType == EventType.TODO){
    //            return EventType.TODO;
    //        }
    //        return EventType.LINKED;
    //    }
    //
    //    private EventType getStatusForCapacityGroup(){
    //        EventType eventType;
    //        if(eventType == EventType.STATUS_IMPROVEMENT){
    //            return EventType.TODO;
    //        }
    //        return EventType.STATUS_REDUCTION;
    //    }

//    @Override
//    public void updateStatus() {
//        saveStatusesData();
//    }

    public void updateStatus() {
        StatusManager statusManager = new StatusManager();
        postStatuses(statusManager.retrieveUpdatedStatusRequest(oldWeekBasedCapacityGroupResponse,newWeekBasedCapacityGroupResponse,
                oldWeekBasedMaterialDemandResponse, newWeekBasedMaterialDemandResponse));
    }
}
