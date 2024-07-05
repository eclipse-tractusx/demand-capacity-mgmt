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

package org.eclipse.tractusx.demandcapacitymgm.backend.services.impl;

import eclipse.tractusx.demandcapacitymgm.specification.model.UnitMeasure;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgm.backend.entities.UnitMeasureEntity;
import org.eclipse.tractusx.demandcapacitymgm.backend.exceptions.type.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgm.backend.repositories.UnitMeasureRepository;
import org.eclipse.tractusx.demandcapacitymgm.backend.services.UnityOfMeasureService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class UnityOfMeasureServiceImpl implements UnityOfMeasureService {

    private final UnitMeasureRepository unitMeasureRepository;

    @Override
    public UnitMeasure findById(UUID id) {
        Optional<UnitMeasureEntity> unitMeasure = unitMeasureRepository.findById(id);

        if (unitMeasure.isEmpty()) {
            throw new BadRequestException("7", "23");
        } else return convertEntityToDto(unitMeasure.get());
    }

    @Override
    public List<UnitMeasure> getAllUnitMeasure() {
        List<UnitMeasureEntity> unitMeasureEntityList = unitMeasureRepository.findAll();

        return unitMeasureEntityList.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public UnitMeasure convertEntityToDto(UnitMeasureEntity unitMeasureEntity) {
        UnitMeasure unitMeasure = new UnitMeasure();

        unitMeasure.setId(String.valueOf(unitMeasureEntity.getId()));
        unitMeasure.setDimension(unitMeasureEntity.getDimension());
        unitMeasure.setUnCode(unitMeasureEntity.getUnCode());
        unitMeasure.setDescription(unitMeasureEntity.getDescription());
        unitMeasure.setDescriptionGerman(unitMeasureEntity.getDescriptionGerman());
        unitMeasure.setUnSymbol(unitMeasureEntity.getUnSymbol());
        unitMeasure.setCxSymbol(unitMeasureEntity.getCxSymbol());

        return unitMeasure;
    }

    @Override
    public UnitMeasureEntity convertDtoToEntity(UnitMeasure unitMeasure) {
        UnitMeasureEntity unitMeasureEntity = new UnitMeasureEntity();

        unitMeasureEntity.setId(UUID.fromString(unitMeasure.getId()));
        unitMeasureEntity.setDimension(unitMeasure.getDimension());
        unitMeasureEntity.setUnCode(unitMeasure.getUnCode());
        unitMeasureEntity.setDescription(unitMeasure.getDescription());
        unitMeasureEntity.setDescriptionGerman(unitMeasure.getDescriptionGerman());
        unitMeasureEntity.setUnSymbol(unitMeasure.getUnSymbol());
        unitMeasureEntity.setCxSymbol(unitMeasure.getCxSymbol());

        return unitMeasureEntity;
    }
}
