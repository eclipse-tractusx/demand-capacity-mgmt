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

import java.util.LinkedList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LinkDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.WeekBasedMaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LinkDemandService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class LinkDemandServiceImpl implements LinkDemandService {

    private final LinkDemandRepository linkDemandRepository;

    @Override
    public void createLinkDemands(List<WeekBasedMaterialDemandEntity> weekBasedMaterialDemandEntities) {
        List<LinkDemandEntity> linkDemandEntityList = new LinkedList<>();

        weekBasedMaterialDemandEntities.forEach(
            weekBasedMaterialDemand -> {
                List<LinkDemandEntity> linkDemandEntity = convertFromWeekBasedMaterial(weekBasedMaterialDemand);

                linkDemandEntityList.addAll(linkDemandEntity);
            }
        );

        linkDemandRepository.saveAll(linkDemandEntityList);
    }

    private List<LinkDemandEntity> convertFromWeekBasedMaterial(WeekBasedMaterialDemandEntity weekBasedMaterialDemand) {
        return weekBasedMaterialDemand
            .getWeekBasedMaterialDemand()
            .getDemandSeries()
            .stream()
            .map(
                demandWeekSeriesDto ->
                    LinkDemandEntity
                        .builder()
                        .linked(false)
                        .demandCategoryId(demandWeekSeriesDto.getDemandCategory().getDemandCategoryCode())
                        .weekBasedMaterialDemand(weekBasedMaterialDemand)
                        .materialNumberSupplier(
                            weekBasedMaterialDemand.getWeekBasedMaterialDemand().getMaterialNumberSupplier()
                        )
                        .materialNumberCustomer(
                            weekBasedMaterialDemand.getWeekBasedMaterialDemand().getMaterialNumberCustomer()
                        )
                        .build()
            )
            .toList();
    }
}
