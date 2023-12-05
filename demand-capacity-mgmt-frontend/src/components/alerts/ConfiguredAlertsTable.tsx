import React, {useContext, useEffect} from "react";
import {AlertsContext} from "../../contexts/AlertsContextProvider";


const ConfiguredAlertsTable = () => {
    const {configuredAlerts, fetchConfiguredAlertsWithRetry } = useContext(AlertsContext)!;

    useEffect(() => {
        fetchConfiguredAlertsWithRetry();
    }, []);


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