/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023, 2024 Contributors to the Eclipse Foundation
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
package org.eclipse.tractusx.demandcapacitymgmt.backend.services.impl;

import eclipse.tractusx.demandcapacitymgm.specification.model.UserRequest;
import eclipse.tractusx.demandcapacitymgm.specification.model.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.UserEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.backend.repositories.UserRepository;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.UserOperationsService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    public List<UserResponse> fetchAllUsers() {
        List<UserEntity> users = repository.findAll();
        List<UserResponse> userResponses = new ArrayList<>();
        for (UserEntity user : users) {
            userResponses.add(convertToDto(user));
        }
        return userResponses;
    }

    private UserResponse convertToDto(UserEntity entity) {
        UserResponse user = new UserResponse();
        user.setUserID(entity.getId().toString());
        user.setEmail(entity.getEmail());
        user.setName(entity.getName());
		eclipse.tractusx.demandcapacitymgm.specification.model.Role role =
			eclipse.tractusx.demandcapacitymgm.specification.model.Role.fromValue(entity.getRole().name());
        user.setRole(role);
        user.setUsername(entity.getUsername());
        user.setCompanyID(String.valueOf(entity.getCompanyID()));
        user.setLastName(entity.getLastName());
        return user;
    }
}
