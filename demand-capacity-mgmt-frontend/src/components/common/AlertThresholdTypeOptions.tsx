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

import React, {useCallback} from "react";
import Select from "react-select";

interface AlertThresholdTypeOptionsProps {
    selectedThresholdTypeId: string;
    onChange: (value: string) => void;
}
const AlertThresholdTypeOptions: React.FC<AlertThresholdTypeOptionsProps> = ({ selectedThresholdTypeId, onChange }) => {
    const options = [
        { value: 'ABSOLUTE', label: 'Absolute' },
        { value: 'RELATIVE', label: 'Relative' },
    ];
    const selectedThresholdType = options?.find((option) => option.value === selectedThresholdTypeId);

    const handleSelectChange = useCallback(
        (selectedOption: { value: string; label: string } | null) => {
            onChange(selectedOption?.value || ''); // Provide a default value ('') if selectedOption is undefined
        },
        [onChange]
    );


    return (
        <Select
            name="monitoredObjectId"
            id="monitoredObjectId"
            options={options}
            value={selectedThresholdType}
            onChange={handleSelectChange}
            placeholder="--Choose an option--"
            noOptionsMessage={() => "No Options"}
            required
            isSearchable
        />
    );
};

export default AlertThresholdTypeOptions;
