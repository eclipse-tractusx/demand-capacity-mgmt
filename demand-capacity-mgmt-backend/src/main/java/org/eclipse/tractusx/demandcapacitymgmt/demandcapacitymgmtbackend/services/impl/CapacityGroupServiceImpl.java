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
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CompanyEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LinkedCapacityGroupMaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.type.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkedCapacityGroupMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CompanyService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
        CapacityGroupEntity capacityGroupEntity = enrichCapacityGroup(capacityGroupRequest);
        capacityGroupEntity = capacityGroupRepository.save(capacityGroupEntity);
        for(UUID uuid : capacityGroupRequest.getLinkMaterialDemandIds()){
            LinkedCapacityGroupMaterialDemandEntity entity = new LinkedCapacityGroupMaterialDemandEntity();
            entity.setCapacityGroup(capacityGroupEntity.getId());
            entity.setLinkedMaterialDemandID(uuid);
            linkedCapacityGroupMaterialDemandRepository.save(entity);
        }
        return convertCapacityGroupDto(capacityGroupEntity);
    }

    private CapacityGroupEntity enrichCapacityGroup(CapacityGroupRequest request){
        CompanyEntity customer = companyService.getCompanyById(
                UUID.fromString(request.getCustomer())
        );
        CompanyEntity supplier = companyService.getCompanyById(
                UUID.fromString(request.getSupplier())
        );

        CapacityGroupEntity capacityGroupEntity = new CapacityGroupEntity();
        capacityGroupEntity.setCapacityGroupName(request.getCapacitygroupname());
        capacityGroupEntity.setDefaultActualCapacity(request.getDefaultActualCapacity());
        capacityGroupEntity.setDefaultMaximumCapacity(request.getDefaultMaximumCapacity());
        capacityGroupEntity.setStartDate(LocalDate.parse(request.getStartDate()));
        capacityGroupEntity.setEndDate(LocalDate.parse(request.getEndDate()));
        capacityGroupEntity.setCustomer(customer);
        capacityGroupEntity.setSupplier(supplier);
        return capacityGroupEntity;
    }

    @Override
    public void linkCapacityGroupToMaterialDemand(LinkedCapacityGroupMaterialDemandRequest linkedMaterialDemandRequest) {
        linkedCapacityGroupMaterialDemandRepository.deleteByCapacityGroup(UUID.fromString(linkedMaterialDemandRequest.getCapacityGroupID()));
        Optional<CapacityGroupEntity> optionalEntity = capacityGroupRepository.findById(
                UUID.fromString(linkedMaterialDemandRequest.getCapacityGroupID())
        );
        for (UUID uuid_helper : linkedMaterialDemandRequest.getLinkedMaterialDemandID()) {
            LinkedCapacityGroupMaterialDemandEntity entity = new LinkedCapacityGroupMaterialDemandEntity();
            if(optionalEntity.isPresent()) {
                CapacityGroupEntity capacityGroupEntity = optionalEntity.get();
                entity.setCapacityGroup(capacityGroupEntity.getId());
                entity.setLinkedMaterialDemandID(uuid_helper);
                linkedCapacityGroupMaterialDemandRepository.save(entity);
            }
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

    private CapacityGroupResponse convertCapacityGroupDto(CapacityGroupEntity capacityGroupEntity) {
        final CapacityGroupResponse responseDto = new CapacityGroupResponse();

        final CompanyDto customer = Optional.ofNullable(capacityGroupEntity.getCustomer())
                .map(companyService::convertEntityToDto)
                .orElse(null);

        final CompanyDto supplier = Optional.ofNullable(capacityGroupEntity.getSupplier())
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
        List<LinkedCapacityGroupMaterialDemandEntity> linkedCGMD =
        linkedCapacityGroupMaterialDemandRepository.
                findLinkedCapacityGroupMaterialDemandEntitiesByCapacityGroup(
                        capacityGroupEntity.getId()
        );
        List<UUID> linkedDemands = new ArrayList<>();
        for(LinkedCapacityGroupMaterialDemandEntity ent : linkedCGMD){
            linkedDemands.add(ent.getLinkedMaterialDemandID());
        }
        responseDto.setLinkMaterialDemandIds(linkedDemands);
        return responseDto;
    }



    private List<CapacityGroupDefaultViewResponse> convertCapacityGroupEntity(
        List<CapacityGroupEntity> capacityGroupEntityList)
    {
        List<CapacityGroupDefaultViewResponse> capacityGroupList = new ArrayList<>();

        for (CapacityGroupEntity entity : capacityGroupEntityList) {
            CapacityGroupDefaultViewResponse response = new CapacityGroupDefaultViewResponse();

            response.setName(entity.getCapacityGroupName());
            response.setSupplierBNPL(entity.getSupplier().getBpn());
            response.setCustomerName(entity.getCustomer().getCompanyName());
            response.setCustomerBPNL(entity.getCustomer().getBpn());
            response.setInternalId(entity.getId().toString());
            capacityGroupList.add(response);
        }
        return capacityGroupList;
    }
}
