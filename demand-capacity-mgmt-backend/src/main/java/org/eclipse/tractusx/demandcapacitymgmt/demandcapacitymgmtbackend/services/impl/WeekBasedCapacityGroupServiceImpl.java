/*
 * *******************************************************************************
 *   Copyright (c) 2023 BMW AG
 *   Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *   See the NOTICE file(s) distributed with this work for additional
 *   information regarding copyright ownership.
 *
 *   This program and the accompanying materials are made available under the
 *   terms of the Apache License, Version 2.0 which is available at
 *   https://www.apache.org/licenses/LICENSE-2.0.
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *   WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *   License for the specific language governing permissions and limitations
 *   under the License.
 *
 *   SPDX-License-Identifier: Apache-2.0
 *   ********************************************************************************
 *
 */

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CapacitiesDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandCategoryDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.LinkedDemandSeriesRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekBasedCapacityGroupRequest;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.CapacityGroupStatus;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CustomerRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.MaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.WeekBasedCapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.WeekBasedCapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@RequiredArgsConstructor
@Service
@Slf4j
public class WeekBasedCapacityGroupServiceImpl implements WeekBasedCapacityGroupService {

    private final WeekBasedCapacityGroupRepository weekBasedCapacityGroupRepository;

    private final CustomerRepository customerRepository;

    private final CapacityGroupService capacityGroupService;

    private final MaterialDemandRepository materialDemandRepository;

    @Override
    public void createWeekBasedCapacityGroup(List<WeekBasedCapacityGroupRequest> weekBasedCapacityGroupRequestList) {
        weekBasedCapacityGroupRequestList.forEach(
            weekBasedCapacityGroupRequest -> {
                validateFields(weekBasedCapacityGroupRequest);

                WeekBasedCapacityGroupEntity weekBasedCapacityGroup = convertEntity(weekBasedCapacityGroupRequest);
                weekBasedCapacityGroupRepository.save(weekBasedCapacityGroup);
            }
        );
    }

    @Override
    public void receiveWeekBasedCapacityGroup() {
        List<WeekBasedCapacityGroupEntity> weekBasedCapacityGroupEntities = weekBasedCapacityGroupRepository.getAllByViewed(
            false
        );

        weekBasedCapacityGroupEntities.forEach(weekBasedCapacityGroupEntity -> {

            WeekBasedCapacityGroupRequest weekBasedCapacityGroup  = weekBasedCapacityGroupEntity.getWeekBasedCapacityGroup();

            if (weekBasedCapacityGroup != null) {

                List<LinkedDemandSeriesRequest> likedDemandSeriesList = weekBasedCapacityGroup.getLinkedDemandSeries();

                if (likedDemandSeriesList != null) {

                    for (LinkedDemandSeriesRequest likedDemandSeries : likedDemandSeriesList) {

                        String materialNumberCustomer = likedDemandSeries.getMaterialNumberCustomer();
                        String customerLocation = likedDemandSeries.getCustomerLocation();
                        String demandCategoryCode = likedDemandSeries.getDemandCategory().getDemandCategory();

                        List<MaterialDemandEntity> matchingDemands = materialDemandRepository.findAllByMaterialNumberCustomerAndDemandSeriesCustomerLocationAndDemandCategory(
                                materialNumberCustomer,
                                customerLocation,
                                demandCategoryCode
                        );

                        matchingDemands.forEach(materialDemandEntity -> {
                            materialDemandEntity.getDemandSeries().forEach(demandSeries -> {

                                demandSeries.setCapacityGroupId(weekBasedCapacityGroup.getCapacityGroupId());
                            });

                        });

                        materialDemandRepository.saveAll(matchingDemands);
                    }
                }
            }

        });

    }

    @Override
    public void sendWeekBasedCapacityGroup() {
        Optional<CustomerEntity> supplierEntityOpt = customerRepository.findById(1l);

        //TODO we still dont have defined the demand or the capacity structure yet, this is just an example of the flux
        if (supplierEntityOpt.isPresent()) {
            CustomerEntity supplierEntity = supplierEntityOpt.get();

            //todo put this part of the code in the ConsumerHTTP class
            RestTemplate restTemplate = new RestTemplate();
            String fooResourceUrl = supplierEntity.getEdcUrl();

            //TODO create the Actual Demand and send to the supplier
            ResponseEntity<String> response = restTemplate.getForEntity(fooResourceUrl, String.class);
        }

        List<CapacityGroupEntity> capacityGroupEntityList = capacityGroupService.getAllByStatus(
            CapacityGroupStatus.READY_SYNCHRONIZE
        );

        capacityGroupEntityList.forEach(this::createWeekBasedCapacityGroupRequestFromEntity);
    }

    @Override
    public void createWeekBasedCapacityGroupRequestFromEntity(CapacityGroupEntity capacityGroupEntity) {
        WeekBasedCapacityGroupRequest basedCapacityGroupRequest = new WeekBasedCapacityGroupRequest();

        basedCapacityGroupRequest.setCapacityGroupId(capacityGroupEntity.getCapacityGroupId().toString());
        basedCapacityGroupRequest.setUnityOfMeasure(capacityGroupEntity.getUnitMeasure().getCodeValue());
        basedCapacityGroupRequest.setCustomer(capacityGroupEntity.getCustomerId().getBpn());
        basedCapacityGroupRequest.setSupplier(capacityGroupEntity.getSupplierId().getBpn());
        basedCapacityGroupRequest.setName(capacityGroupEntity.getName());
        basedCapacityGroupRequest.setChangedAt(capacityGroupEntity.getChangedAt().toString());
        basedCapacityGroupRequest.setSupplierLocations(capacityGroupEntity.getSupplierLocation());

        List<LinkedDemandSeriesRequest> linkedDemandSeries = capacityGroupEntity
            .getLinkedDemandSeries()
            .stream()
            .map(WeekBasedCapacityGroupServiceImpl::getLinkedDemandSeries)
            .toList();
        basedCapacityGroupRequest.setLinkedDemandSeries(linkedDemandSeries);

        List<CapacitiesDto> capacitiesDtos = capacityGroupEntity
            .getCapacityTimeSeries()
            .stream()
            .map(WeekBasedCapacityGroupServiceImpl::getCapacitiesDto)
            .toList();

        basedCapacityGroupRequest.setCapacities(capacitiesDtos);
    }

    private static CapacitiesDto getCapacitiesDto(CapacityTimeSeries capacityTimeSeries) {
        CapacitiesDto capacitiesDto = new CapacitiesDto();

        capacitiesDto.setActualCapacity(capacityTimeSeries.getActualCapacity().toString());
        capacitiesDto.setMaximumCapacity(capacitiesDto.getMaximumCapacity());
        capacitiesDto.setCalendarWeek(capacitiesDto.getCalendarWeek());

        return capacitiesDto;
    }

    private static LinkedDemandSeriesRequest getLinkedDemandSeries(LinkedDemandSeries linkedDemandSeries1) {
        LinkedDemandSeriesRequest linkedDemandSeriesRequest = new LinkedDemandSeriesRequest();
        DemandCategoryDto demandCategoryDto = new DemandCategoryDto();
        demandCategoryDto.setDemandCategory(linkedDemandSeries1.getDemandCategory().getDemandCategoryCode());

        linkedDemandSeriesRequest.setDemandCategory(demandCategoryDto);
        linkedDemandSeriesRequest.setCustomerLocation(linkedDemandSeries1.getCustomerId().getBpn());
        linkedDemandSeriesRequest.setMaterialNumberCustomer(linkedDemandSeries1.getMaterialNumberCustomer());
        linkedDemandSeriesRequest.setMaterialNumberSupplier(linkedDemandSeries1.getMaterialNumberSupplier());

        return linkedDemandSeriesRequest;
    }

    private void validateFields(WeekBasedCapacityGroupRequest weekBasedCapacityGroupRequest) {
        if (!UUIDUtil.checkValidUUID(weekBasedCapacityGroupRequest.getCapacityGroupId())) {
            throw new BadRequestException("not a valid ID");
        }
    }

    private WeekBasedCapacityGroupEntity convertEntity(WeekBasedCapacityGroupRequest weekBasedCapacityGroupRequest) {

        return WeekBasedCapacityGroupEntity
                .builder()
                .weekBasedCapacityGroup(weekBasedCapacityGroupRequest)
                .viewed(false)
                .build();
    }
}
