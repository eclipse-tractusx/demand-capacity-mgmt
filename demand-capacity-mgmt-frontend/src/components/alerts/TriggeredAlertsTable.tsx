import React from "react";
import { TriggeredAlertProps } from "../../interfaces/alert_interface";

interface TriggeredAlertsTableProps {
    triggeredAlerts: TriggeredAlertProps[];
}

const TriggeredAlertsTable: React.FC<TriggeredAlertsTableProps> = ({ triggeredAlerts }) => {
    return (
        <table className="table table-striped table-hover">
            <thead>
            <tr>
                <th></th>
                <th>Alert Name</th>
                <th>Created At</th>
                <th>Description</th>
                <th>Monitored Objects</th>
                <th>Threshold</th>
                <th>Type</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {triggeredAlerts.map((alert) => (
                <tr key={alert.id}>
                    <td></td>
                    <td>{alert.alertName ?? '-'}</td>
                    <td>{alert.created ? new Date(alert.created).toLocaleString() : '-'}</td>
                    <td>{alert.description ?? '-'}</td>
                    <td>{alert.monitoredObjects ?? '-'}</td>
                    <td>{alert.threshold ?? '-'}</td>
                    <td>{alert.type ?? '-'}</td>
                    <td></td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default TriggeredAlertsTable;