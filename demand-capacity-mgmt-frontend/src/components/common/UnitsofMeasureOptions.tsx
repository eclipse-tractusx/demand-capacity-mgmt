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
import React, { useCallback, useContext } from 'react';
import Select from 'react-select';
import { UnitsofMeasureContext } from '../../contexts/UnitsOfMeasureContextProvider';

interface UnitsOfMeasureOptionsProps {
    selectedUnitMeasureId: string;
    onChange: (value: string) => void;
}

const UnitsOfMeasureOptions: React.FC<UnitsOfMeasureOptionsProps> = ({ selectedUnitMeasureId, onChange }) => {
    const UnitsOfMeasureContextData = useContext(UnitsofMeasureContext);
    const { unitsofmeasure } = UnitsOfMeasureContextData || {};

    const options = unitsofmeasure?.map((unit) => ({
        value: unit.id,
        label: `${unit.dimension || ''} | ${unit.unCode || ''} | ${unit.description || ''} | ${unit.descriptionGerman || ''} | ${unit.unSymbol || ''} | ${unit.cxSymbol || ''}`,
    }));

    const selectedOption = options?.find((option) => option.value === selectedUnitMeasureId);

    const handleSelectChange = useCallback(
        (selectedOption: { value: string; label: string } | null) => {
            onChange(selectedOption?.value || ''); // Provide a default value ('') if selectedOption is undefined
        },
        [onChange]
    );


    return (
        <Select
            name="unitMeasureId"
            id="unitMeasureId"
            options={options}
            value={selectedOption}
            onChange={handleSelectChange}
            placeholder="--Choose an option--"
            noOptionsMessage={() => "No unit of measure matches criteria"}
            required
            isSearchable
        />
    );
};

export default UnitsOfMeasureOptions;
