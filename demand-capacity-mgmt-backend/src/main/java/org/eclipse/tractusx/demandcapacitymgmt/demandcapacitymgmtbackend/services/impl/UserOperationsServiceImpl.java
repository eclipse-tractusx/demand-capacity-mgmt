/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
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
package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.UserEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.UserRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.UserOperationsService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserOperationsServiceImpl implements UserOperationsService {

    private final UserRepository repository;

    @Override
    public void updateUser(UserRequest request) {
        Optional<UserEntity> userEntity = repository.findById(UUID.fromString(request.getUserID()));
        if (userEntity.isPresent()) {
            UserEntity user = userEntity.get();
            user.setRole(Role.valueOf(request.getRole().name()));
            user.setUsername(request.getUsername());
            user.setName(request.getName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setCompanyID(UUID.fromString(request.getCompanyID()));
            repository.save(user);
        }
    }
}
