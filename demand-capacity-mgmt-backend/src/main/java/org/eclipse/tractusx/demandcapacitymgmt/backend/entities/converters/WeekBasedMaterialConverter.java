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

package org.eclipse.tractusx.demandcapacitymgmt.backend.entities.converters;

import com.google.gson.Gson;
import eclipse.tractusx.demandcapacitymgm.specification.model.WeekBasedMaterialDemandRequest;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class WeekBasedMaterialConverter implements AttributeConverter<WeekBasedMaterialDemandRequest, String> {

    private static final Gson GSON = new Gson();

    @Override
    public String convertToDatabaseColumn(WeekBasedMaterialDemandRequest mjo) {
        return GSON.toJson(mjo);
    }

    @Override
    public WeekBasedMaterialDemandRequest convertToEntityAttribute(String dbData) {
        return GSON.fromJson(dbData, WeekBasedMaterialDemandRequest.class);
    }
}
