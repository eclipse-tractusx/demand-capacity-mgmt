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

import React, {createContext, useEffect, useState} from 'react';
import { ThresholdProp } from '../interfaces/Threshold_interfaces'
import createAPIInstance from "../util/Api";
import {useUser} from "./UserContext";
import {EventProp} from "../interfaces/event_interfaces";
interface ThresholdsContextData {
    thresholds: ThresholdProp[];
    fetchThresholds: () => Promise<void>;
}

export const ThresholdsContext = createContext<ThresholdsContextData | undefined> (undefined);

const ThresholdContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const { access_token } = useUser();
    const [thresholds, setThresholds] = useState<ThresholdProp[]>([])

    const fetchThresholds = async () => {
        try {
            const api = createAPIInstance(access_token);
            const response = await api.get('/rules/');
            const result: ThresholdProp[] = response.data;
            setThresholds(result);
        } catch (error) {
            console.error('Error fetching event history:', error);
        }
    };

    useEffect(() => {
        fetchThresholds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [access_token]);

    return (
        <ThresholdsContext.Provider value={{ thresholds, fetchThresholds }}>
            {props.children}
        </ThresholdsContext.Provider>
    );
}

export default ThresholdContextProvider;