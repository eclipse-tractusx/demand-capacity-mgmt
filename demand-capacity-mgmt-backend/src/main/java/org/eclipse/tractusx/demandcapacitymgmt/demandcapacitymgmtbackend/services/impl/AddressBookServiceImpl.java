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

import eclipse.tractusx.demand_capacity_mgmt_specification.model.AddressBookRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.AddressBookRecordEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.AddressBookRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.AddressBookService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.GoldenRecordManager;
import org.springframework.stereotype.Service;

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
    public AddressBookRecordEntity getRecord(AddressBookRequest request) {
        if(Boolean.FALSE.equals(request.getDirectQuery())){
            Optional<AddressBookRecordEntity> entity = repository.findById(UUID.fromString(request.getQuery()));
            if(entity.isPresent()){
                return entity.get();
            }
        } else {
            //TODO GOLDEN RECORD IMPL
            return null;
        }
        return null;
    }

    @Override
    public List<AddressBookRecordEntity> getRecords(AddressBookRequest request) {
        List<AddressBookRecordEntity> records;
        if(Boolean.TRUE.equals(request.getDirectQuery())){
            return null;
        } else {
            records = repository.findByNameOrCompanyId(request.getQuery(), UUID.fromString(request.getQuery()));
            return records;
        }
    }

    @Override
    public AddressBookRecordEntity postRecord(AddressBookRequest request) {
        AddressBookRecordEntity entity = goldenRecordManager.createRecord(request.getQuery());
        return entity;
    }

    @Override
    public void deleteRecord(AddressBookRequest request) {
        repository.deleteById(UUID.fromString(request.getQuery()));
    }
}
