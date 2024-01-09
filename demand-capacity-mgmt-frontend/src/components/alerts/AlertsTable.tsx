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

import React, { useMemo, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import {
    FaArrowDown,
    FaArrowUp
} from 'react-icons/fa';
import { TriggeredAlertProps } from '../../interfaces/alert_interface';
import Pagination from '../common/Pagination';

interface AlertsTableProps {
    alerts: TriggeredAlertProps[];
}

const AlertsTable: React.FC<AlertsTableProps> = ({ alerts }) => {
    const [sortField, setSortField] = useState<string>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [alertsPerPage, setAlertsPerPage] = useState<number>(20);


    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const sortedData = useMemo(() => {
        const sortedArray = [...alerts].sort((a, b) => {
            let comparison = 0;
            if (sortField === 'timestamp' && a.created && b.created) {
                const dateA = new Date(a.created).getTime();
                const dateB = new Date(b.created).getTime();
                comparison = dateB - dateA; // Most recent events first
            } else if (sortField !== 'timestamp' && a[sortField as keyof TriggeredAlertProps] && b[sortField as keyof TriggeredAlertProps]) {
                const fieldA = a[sortField as keyof TriggeredAlertProps] as string;
                const fieldB = b[sortField as keyof TriggeredAlertProps] as string;
                comparison = fieldA.localeCompare(fieldB);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        return sortedArray;
    }, [alerts, sortField, sortOrder]);

    const indexOfLastAlert = currentPage * alertsPerPage;
    const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
    const currentAlerts = sortedData.slice(indexOfFirstAlert, indexOfLastAlert);
    const totalPagesNum = Math.ceil(sortedData.length / alertsPerPage);


    return (
        <>
            <div className='table-responsive table-overflow-control mt-2'>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th onClick={() => handleSort('timestamp')}>
                                Timestamp {sortField === 'timestamp' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('eventId')}>
                                Alert Name {sortField === 'eventId' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('objectId')}>
                                Description {sortField === 'objectId' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('eventType')}>
                                Monitored Objects {sortField === 'eventType' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('objectType')}>
                                Threshold {sortField === 'objectType' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('eventDescription')}>
                                Type {sortField === 'eventDescription' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAlerts.map((alert, index) => (
                            <tr key={index}>
                                <td>{new Date(alert.created).toLocaleString()}</td>
                                <td>{alert.alertName ?? '-'}</td>
                                <td>{alert.description ?? '-'}</td>
                                <td>{alert.monitoredObjects ?? '-'}</td>
                                <td>{alert.threshold ?? '-'}</td>
                                <td>{alert.type ?? '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-2">
                <div className="row">
                    <Pagination
                        pages={totalPagesNum}
                        setCurrentPage={setCurrentPage}
                        currentItems={currentAlerts}
                        items={alerts}
                    />
                    <div className="col-sm">
                        <div className="float-end">
                            <Form>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6">
                                        Per Page:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="number"
                                            aria-describedby="capacitygroupsPerPageInput"
                                            min={1}
                                            htmlSize={10}
                                            max={100}
                                            value={alertsPerPage}
                                            onChange={(e) => setAlertsPerPage(Number(e.target.value))}
                                        />
                                    </Col>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlertsTable;



