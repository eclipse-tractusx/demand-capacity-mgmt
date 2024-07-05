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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.AddressBookRecordEntity;
import org.eclipse.tractusx.demandcapacitymgmt.backend.repositories.AddressBookRepository;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.GoldenRecordManager;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoldenRecordManagerImpl implements GoldenRecordManager {

    private final AddressBookRepository repository;

    //TODO ACTUAL PROPER IMPLEMENTATION
    @Override
    public AddressBookRecordEntity queryGoldenRecord(String recordQuery) {
        return null;
    }

    @Override
    public AddressBookRecordEntity createRecord(AddressBookRequest request) {
        AddressBookRecordEntity recordEntity = new AddressBookRecordEntity();
        recordEntity.setCompanyId(UUID.fromString(request.getQuery()));
        recordEntity.setName(request.getAddressBook().getName());
        recordEntity.setContact(request.getAddressBook().getContact());
        recordEntity.setEmail(request.getAddressBook().getEmail());
        recordEntity.setPicture(request.getAddressBook().getPicture());
        recordEntity.setFunction(request.getAddressBook().getFunction());
        repository.save(recordEntity);
        return recordEntity;
    }

    @Override
    public AddressBookRecordEntity updateRecord(AddressBookRequest request, String id) {
        AddressBookRecordEntity recordEntity = new AddressBookRecordEntity();
        recordEntity.setId(UUID.fromString(id));
        recordEntity.setCompanyId(UUID.fromString(request.getQuery()));
        recordEntity.setName(request.getAddressBook().getName());
        recordEntity.setContact(request.getAddressBook().getContact());
        recordEntity.setEmail(request.getAddressBook().getEmail());
        recordEntity.setPicture(request.getAddressBook().getPicture());
        recordEntity.setFunction(request.getAddressBook().getFunction());
        repository.save(recordEntity);
        return recordEntity;
    }
}
