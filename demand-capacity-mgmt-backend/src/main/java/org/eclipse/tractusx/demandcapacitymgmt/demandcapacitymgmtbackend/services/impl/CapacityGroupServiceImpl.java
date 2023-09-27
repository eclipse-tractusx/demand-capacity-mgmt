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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LinkedCapacityGroupMaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkedCapacityGroupMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CompanyService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class CapacityGroupServiceImpl implements CapacityGroupService {

    private final CompanyService companyService;
    private final LinkedCapacityGroupMaterialDemandRepository linkedCapacityGroupMaterialDemandRepository;
    private final CapacityGroupRepository capacityGroupRepository;

    @Override
    public CapacityGroupResponse createCapacityGroup(CapacityGroupRequest capacityGroupRequest) {
        validateRequestFields(capacityGroupRequest);

        CapacityGroupEntity capacityGroupEntity = new CapacityGroupEntity();

        capacityGroupEntity = capacityGroupRepository.save(capacityGroupEntity);

        return convertCapacityGroupDto(capacityGroupEntity);
    }

    @Override
    public void linkCapacityGroupToMaterialDemand(LinkedCapacityGroupMaterialDemandRequest linkedMaterialDemandRequest) {
        linkedCapacityGroupMaterialDemandRepository.deleteByCapacityGroupID(UUID.fromString(linkedMaterialDemandRequest.getCapacityGroupID()));
        for (UUID uuid_helper : linkedMaterialDemandRequest.getLinkedMaterialDemandID()) {
            LinkedCapacityGroupMaterialDemandEntity entity = new LinkedCapacityGroupMaterialDemandEntity();
            entity.setCapacityGroupID(UUID.fromString(linkedMaterialDemandRequest.getCapacityGroupID()));
            entity.setLinkedMaterialDemandID(uuid_helper);
            linkedCapacityGroupMaterialDemandRepository.save(entity);
        }
    }

    @Override
    public CapacityGroupResponse getCapacityGroupById(String capacityGroupId) {
        CapacityGroupEntity capacityGroupEntity = getCapacityGroupEntity(capacityGroupId);
        return convertCapacityGroupDto(capacityGroupEntity);
    }

    @Override
    public List<CapacityGroupDefaultViewResponse> getAll() {
        List<CapacityGroupEntity> capacityGroupEntityList = capacityGroupRepository.findAll();
        return convertCapacityGroupEntity(capacityGroupEntityList);
    }

    private CapacityGroupEntity getCapacityGroupEntity(String capacityGroupId) {
        UUIDUtil.checkValidUUID(capacityGroupId);
        UUID uuid = UUIDUtil.generateUUIDFromString(capacityGroupId);
        Optional<CapacityGroupEntity> capacityGroup = capacityGroupRepository.findById(uuid);

        if (capacityGroup.isEmpty()) {
            throw new NotFoundException(
                404,
                "The capacity group provided was not found",
                new ArrayList<>(List.of("UUID provided : " + uuid))
            );
        }

        return capacityGroup.get();
    }

    private void validateRequestFields(CapacityGroupRequest capacityGroupRequest) {
        if (!UUIDUtil.checkValidUUID(capacityGroupRequest.getCustomer())) {
            throw new BadRequestException(
                400,
                "Not a valid customer ID",
                new ArrayList<>(List.of(capacityGroupRequest.getCustomer()))
            );
        }

        if (!UUIDUtil.checkValidUUID(capacityGroupRequest.getSupplier())) {
            throw new BadRequestException(
                400,
                "Not a valid supplier ID",
                new ArrayList<>(List.of(capacityGroupRequest.getSupplier()))
            );
        }

    }

    private CapacityGroupResponse convertCapacityGroupDto(CapacityGroupEntity capacityGroupEntity) {
        final CapacityGroupResponse responseDto = new CapacityGroupResponse();

        final CompanyDto customer = Optional.ofNullable(capacityGroupEntity.getCustomerId())
                .map(companyService::convertEntityToDto)
                .orElse(null);

        final CompanyDto supplier = Optional.ofNullable(capacityGroupEntity.getSupplierId())
                .map(companyService::convertEntityToDto)
                .orElse(null);

        responseDto.setCapacityGroupId(Optional.ofNullable(capacityGroupEntity.getId()).map(UUID::toString).orElse(null));
        responseDto.setCapacitygroupname(capacityGroupEntity.getCapacityGroupName());
        responseDto.setDefaultActualCapacity(capacityGroupEntity.getDefaultActualCapacity());
        responseDto.setDefaultMaximumCapacity(capacityGroupEntity.getDefaultMaximumCapacity());
        responseDto.setStartDate(Optional.ofNullable(capacityGroupEntity.getStartDate()).map(Object::toString).orElse(null));
        responseDto.setEndDate(Optional.ofNullable(capacityGroupEntity.getEndDate()).map(Object::toString).orElse(null));
        responseDto.setCustomer(customer);
        responseDto.setSupplier(supplier);

        final CapacityGroupResponseLinkMaterialDemandIds ids = new CapacityGroupResponseLinkMaterialDemandIds();
        Optional.ofNullable(capacityGroupEntity.getLinkedMaterialDemands())
                .ifPresent(linkedMaterialDemands -> linkedMaterialDemands.stream()
                        .map(LinkedCapacityGroupMaterialDemandEntity::getLinkedMaterialDemandID)
                        .forEach(ids::addLinkedMaterialDemandIdItem));

        responseDto.setLinkMaterialDemandIds(ids);

        return responseDto;
    }



    private List<CapacityGroupDefaultViewResponse> convertCapacityGroupEntity(
        List<CapacityGroupEntity> capacityGroupEntityList)
    {
        List<CapacityGroupDefaultViewResponse> capacityGroupList = new ArrayList<>();

        for (CapacityGroupEntity entity : capacityGroupEntityList) {
            CapacityGroupDefaultViewResponse response = new CapacityGroupDefaultViewResponse();

            response.setName(entity.getCapacityGroupName());
            response.setSupplierBNPL(entity.getSupplierId().getBpn());
            response.setCustomerName(entity.getCustomerId().getCompanyName());
            response.setCustomerBPNL(entity.getCustomerId().getBpn());
            response.setInternalId(entity.getId().toString());
            capacityGroupList.add(response);
        }
        return capacityGroupList;
    }
}
