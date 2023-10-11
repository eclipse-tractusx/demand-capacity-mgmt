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

import React, { useContext } from 'react';
import { UnitsofMeasureContext } from '../../contexts/UnitsOfMeasureContextProvider';

interface UnitsOfMeasureOptionsProps {
    selectedUnitMeasureId: string;
}

const UnitsOfMeasureOptions: React.FC<UnitsOfMeasureOptionsProps> = ({ selectedUnitMeasureId }) => {
    const UnitsOfMeasureContextData = useContext(UnitsofMeasureContext);
    const { unitsofmeasure } = UnitsOfMeasureContextData || {};

    // Use the demandcategories array to fill the <select> options
    return (
        <>
            {unitsofmeasure &&
                unitsofmeasure.map((unit) => (
                    <option key={unit.id} value={unit.id} selected={unit.id === selectedUnitMeasureId}>
                        {unit.dimension && `${unit.dimension} | `}
                        {unit.unCode && `${unit.unCode} | `}
                        {unit.description && `${unit.description} | `}
                        {unit.descriptionGerman && `${unit.descriptionGerman} | `}
                        {unit.unSymbol && `${unit.unSymbol} | `}
                        {unit.cxSymbol && unit.cxSymbol}
                    </option>
                ))}
        </>
    );

};

export default UnitsOfMeasureOptions;

