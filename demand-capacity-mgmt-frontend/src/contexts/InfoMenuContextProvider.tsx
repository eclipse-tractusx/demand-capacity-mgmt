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


import React, { createContext, useState, useEffect, useCallback, useContext, FunctionComponent } from 'react';
import { InfoMenuData } from '../interfaces/InfoMenu_interfaces';
import {useUser} from "./UserContext";
import createAPIInstance from "../util/Api";

interface InfoMenuContextData {
    data: InfoMenuData | null;
    fetchData: () => void;
}

export const InfoMenuContext = createContext<InfoMenuContextData | undefined>(undefined);

interface InfoMenuProviderProps {
    children: React.ReactNode;
}

export const InfoMenuProvider: FunctionComponent<InfoMenuProviderProps> = ({ children }) => {
    const [data, setData] = useState<InfoMenuData | null>(null);
    const { accessToken } = useUser();
    const fetchData = useCallback(async () => {
        try {
            const api = createAPIInstance(accessToken);
            const response = await api.get('/statuses');
            const result: InfoMenuData = response.data;
            setData(result);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData,accessToken]);

    return (
        <InfoMenuContext.Provider value={{ data, fetchData }}>
            {children}
        </InfoMenuContext.Provider>
    );
};

export const useInfoMenu = () => {
    const context = useContext(InfoMenuContext);
    if (!context) {
        throw new Error('useInfoMenu must be used within an InfoMenuProvider');
    }
    return context;
};