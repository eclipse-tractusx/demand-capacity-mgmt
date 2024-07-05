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

package org.eclipse.tractusx.demandcapacitymgmt.backend.services.impl;

import eclipse.tractusx.demandcapacitymgm.specification.model.LoggingHistoryRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.LinkDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.WeekBasedMaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.backend.repositories.LinkDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.LinkDemandService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.LoggingHistoryService;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class LinkDemandServiceImpl implements LinkDemandService {

    private final LinkDemandRepository linkDemandRepository;

    private final LoggingHistoryService loggingHistoryService;

    @Override
    public void createLinkDemands(List<WeekBasedMaterialDemandEntity> weekBasedMaterialDemandEntities) {
        List<LinkDemandEntity> linkDemandEntityList = new LinkedList<>();

		weekBasedMaterialDemandEntities.forEach(weekBasedMaterialDemand -> {
			List<LinkDemandEntity> linkDemandEntity = convertFromWeekBasedMaterial(weekBasedMaterialDemand);

			linkDemandEntityList.addAll(linkDemandEntity);
		});
        postLogs();
        linkDemandRepository.saveAll(linkDemandEntityList);
    }

    private void postLogs() {
        LoggingHistoryRequest loggingHistoryRequest = new LoggingHistoryRequest();
        loggingHistoryRequest.setObjectType(EventObjectType.LINK_DEMAND_SERVICE.name());
        loggingHistoryRequest.setEventType(EventType.GENERAL_EVENT.toString());
        loggingHistoryRequest.setEventDescription("LinkDemands Created");
        loggingHistoryRequest.setLogID(UUID.randomUUID().toString());
        loggingHistoryService.createLog(loggingHistoryRequest);
    }

    private List<LinkDemandEntity> convertFromWeekBasedMaterial(WeekBasedMaterialDemandEntity weekBasedMaterialDemand) {
        return weekBasedMaterialDemand
            .getWeekBasedMaterialDemand()
            .getDemandSeries()
            .stream()
			.map(demandWeekSeriesDto ->
				LinkDemandEntity.builder()
					.linked(false) //Id =id
					.demandCategoryId(demandWeekSeriesDto.getDemandCategory().getId())
					.weekBasedMaterialDemand(weekBasedMaterialDemand)
					.materialNumberSupplier(
						weekBasedMaterialDemand.getWeekBasedMaterialDemand().getMaterialNumberSupplier()
					)
					.materialNumberCustomer(
						weekBasedMaterialDemand.getWeekBasedMaterialDemand().getMaterialNumberCustomer()
					)
					.build())
            .toList();
    }
}
