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
import { useContext, useEffect } from "react";
import { AlertsContext } from "../../contexts/AlertsContextProvider";


const ConfiguredAlertsTable = () => {
    const { configuredAlerts, fetchConfiguredAlertsWithRetry } = useContext(AlertsContext)!;

    useEffect(() => {
        fetchConfiguredAlertsWithRetry();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps


    return <table
        className="table table-striped table-hover">
        <thead>
            <tr>
                <th>AlertName</th>
                <th>Created At</th>
                <th>Monitored Objects</th>
                <th>Threshold</th>
                <th>type</th>
                <th>Trigger Times</th>
                {/*<th>Trigger Times/3 Months</th>*/}
            </tr>
        </thead>
        <tbody>
            {configuredAlerts.map((alert) => (
                <tr key={alert.id}>
                    <td>{alert.alertName ?? '-'}</td>
                    <td>{alert.created ? new Date(alert.created).toLocaleString() : '-'}</td>
                    <td>{alert.monitoredObjects ?? '-'}</td>
                    <td>{alert.threshold ?? '-'}</td>
                    <td>{alert.type ?? '-'}</td>
                    <td>{alert.triggerTimes ?? '-'}</td>
                    {/*<td>{alert.triggerTimesInThreeMonths ?? '-'}</td>*/}
                    <td></td>
                </tr>))}
        </tbody>
    </table>
}

export default ConfiguredAlertsTable;