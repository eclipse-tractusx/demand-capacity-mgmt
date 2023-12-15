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

import React, { createContext, useCallback, useEffect, useState } from 'react';
import {
    CapacityGroupCreate,
    CapacityGroupLink,
    CapacityGroupProp,
    SingleCapacityGroup
} from '../interfaces/capacitygroup_interfaces';
import createAPIInstance from "../util/Api";
import { useUser } from './UserContext';
import {ConfiguredAlertProps, TriggeredAlertProps} from "../interfaces/alert_interface";


interface AlertsContextData {
    triggeredAlerts: TriggeredAlertProps[];
    configuredAlerts: ConfiguredAlertProps[];
    fetchTriggeredAlertsWithRetry: () => Promise<void>;
    fetchConfiguredAlertsWithRetry: () => Promise<void>;
    isLoading: boolean;
    configureAlert: (newConfiguredAlert: ConfiguredAlertProps) => Promise<ConfiguredAlertProps | undefined>;
}

export const AlertsContext = createContext<AlertsContextData | undefined>(undefined);


const AlertsContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const { access_token } = useUser();
    const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlertProps[]>([]);
    const [configuredAlerts, setConfiguredAlerts] = useState<ConfiguredAlertProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;
    const api = createAPIInstance(access_token);


    const fetchTriggeredAlertsWithRetry = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await api.get('/triggeredAlerts', {});
            const result: TriggeredAlertProps[] = response.data;
            console.error(`TriggeredAlertProps :`, result);
            setTriggeredAlerts(result);
        } catch (error) {
            console.error(`Error fetching Triggered Alerts (Retry ${retryCount + 1}):`, error);

            if (retryCount < maxRetries - 1) {
                // If not the last retry, delay for 30 seconds before the next retry
                await new Promise((resolve) => setTimeout(resolve, 30000));
                setRetryCount(retryCount + 1); // Increment the retry count
            } else {
                // If the last retry failed, do not retry further
                setRetryCount(0); // Reset the retry count
            }
        } finally {
            // Set isLoading to false regardless of success or failure
            setIsLoading(false);
        }
    }, [retryCount, setTriggeredAlerts, setIsLoading, setRetryCount, api]);


    const fetchConfiguredAlertsWithRetry = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await api.get('/alerts', {});
            const result: ConfiguredAlertProps[] = response.data;
            setConfiguredAlerts(result);
            console.error(`Error fetching ConfiguredAlerts (Retry ${retryCount + 1}):`, result);

        } catch (error) {
            console.error(`Error fetching ConfiguredAlerts (Retry ${retryCount + 1}):`, error);

            if (retryCount < maxRetries - 1) {
                // If not the last retry, delay for 30 seconds before the next retry
                await new Promise((resolve) => setTimeout(resolve, 30000));
                setRetryCount(retryCount + 1); // Increment the retry count
            } else {
                // If the last retry failed, do not retry further
                setRetryCount(0); // Reset the retry count
            }
        } finally {
            // Set isLoading to false regardless of success or failure
            setIsLoading(false);
        }
    }, [retryCount, setConfiguredAlerts, setIsLoading, setRetryCount, api]);

    useEffect(() => {
        if (retryCount < maxRetries) {
            fetchTriggeredAlertsWithRetry();
            fetchConfiguredAlertsWithRetry();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryCount, maxRetries]);


    const configureAlert = async (newConfiguredAlert: ConfiguredAlertProps): Promise<ConfiguredAlertProps | undefined> => {
        try {
            const api = createAPIInstance(access_token);
            const response = await api.post('/alerts', newConfiguredAlert);
            return response.data;
        } catch (error) {
            console.error('Error creating alert:', error);
        }
    };

    return (
        <AlertsContext.Provider value={{ triggeredAlerts, configuredAlerts, fetchTriggeredAlertsWithRetry, fetchConfiguredAlertsWithRetry, isLoading, configureAlert }}>
            {props.children}
        </AlertsContext.Provider>
    );
};

export default AlertsContextProvider;
