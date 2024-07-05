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

import eclipse.tractusx.demandcapacitymgm.specification.model.AddressBookRequest;
import eclipse.tractusx.demandcapacitymgm.specification.model.AddressBookResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.AddressBookRecordEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.repositories.AddressBookRepository;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.AddressBookService;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.GoldenRecordManager;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class AddressBookServiceImpl implements AddressBookService {

    private final AddressBookRepository repository;

    private final GoldenRecordManager goldenRecordManager;

    @Override
    public AddressBookResponse getRecord(AddressBookRequest request) {
        if (Boolean.FALSE.equals(request.getDirectQuery())) {
            Optional<AddressBookRecordEntity> entity = repository.findById(UUID.fromString(request.getQuery()));
            if (entity.isPresent()) {
                return convertEntityToDto(entity.get());
            }
        } else {
            //TODO GOLDEN RECORD IMPL
            return null;
        }
        return null;
    }

    @Override
    public List<AddressBookResponse> getRecords() {
        List<AddressBookRecordEntity> records;
        records = repository.findAll();
        List<AddressBookResponse> response = new ArrayList<>();
        for (AddressBookRecordEntity ent : records) {
            response.add(convertEntityToDto(ent));
        }
        return response;
    }

    @Override
    public AddressBookResponse postRecord(AddressBookRequest request) {
        return convertEntityToDto(goldenRecordManager.createRecord(request));
    }

    @Override
    public AddressBookResponse updateRecord(AddressBookRequest request, String id) {
        return convertEntityToDto(goldenRecordManager.updateRecord(request, id));
    }

    @Override
    public void deleteRecord(AddressBookRequest request) {
        repository.deleteById(UUID.fromString(request.getQuery()));
    }

    private AddressBookResponse convertEntityToDto(AddressBookRecordEntity entity) {
        AddressBookResponse response = new AddressBookResponse();
        response.setId(entity.getId().toString());
        response.setContact(entity.getContact());
        response.setName(entity.getName());
        response.setEmail(entity.getEmail());
        response.setFunction(entity.getFunction());
        response.setCompanyId(entity.getCompanyId().toString());
        response.setPicture(entity.getPicture());
        return response;
    }
}
