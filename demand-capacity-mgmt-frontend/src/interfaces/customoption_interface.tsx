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

import React from 'react';
import { LuStar } from 'react-icons/lu';
import { OptionProps } from 'react-select';

const CustomOption: React.FC<OptionProps<any, false>> = ({ innerProps, label, isFocused, isSelected, data }) => {
    const { isFavorite } = data;

    const optionStyle = {
        backgroundColor: isSelected ? '#f0f0f0' : isFocused ? '#e0e0e0' : 'white',
        cursor: 'pointer',
        padding: '8px 12px',
    };

    return (
        <div {...innerProps} style={optionStyle} >
            {isFavorite && <LuStar className="text-warning" style={{ margin: " 0 10 0 0px" }} />}{label}
        </div>
    );
};

export default CustomOption;
