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
import Table from 'react-bootstrap/Table';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import Pagination from '../common/Pagination';
// Example data
const eventData = [
    {
        eventId: 'E001',
        eventType: 'Login',
        status: 'Success',
        objectId: 'U001',
        type: 'User',
        name: 'Alice',
        timestamp: '2023-10-04T10:00:00Z'
    },
    {
        eventId: 'E002',
        eventType: 'Logout',
        status: 'Success',
        objectId: 'U002',
        type: 'User',
        name: 'Bob',
        timestamp: '2023-10-04T11:00:00Z'
    },
    // Add more event data as needed
];


const EventsTable: React.FC = () => {
    const [sortField, setSortField] = useState<string>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [eventsPerPage, setEventsPerPage] = useState<number>(10);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const sortedData = useMemo(() => {
        const sortedArray = [...eventData].sort((a, b) => {
            let comparison = 0;
            if ((a as any)[sortField] > (b as any)[sortField]) {
                comparison = 1;
            } else if ((a as any)[sortField] < (b as any)[sortField]) {
                comparison = -1;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        return sortedArray;
    }, [eventData, sortField, sortOrder]);

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = sortedData.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPagesNum = Math.ceil(sortedData.length / eventsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="table-title">
                <div className="row">
                    <div className="col-sm-6">
                        Events
                    </div>
                    <div className="col-sm-6">
                        Filters
                    </div>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('timestamp')}>
                            Timestamp {sortField === 'timestamp' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                        </th>
                        <th onClick={() => handleSort('eventId')}>
                            Event ID {sortField === 'eventId' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                        </th>
                        <th onClick={() => handleSort('eventType')}>
                            Event Type {sortField === 'eventType' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                        </th>
                        <th onClick={() => handleSort('status')}>
                            Status {sortField === 'status' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                        </th>
                        <th onClick={() => handleSort('objectId')}>
                            Object ID {sortField === 'objectId' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                        </th>
                        <th onClick={() => handleSort('type')}>
                            Type {sortField === 'type' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                        </th>
                        <th onClick={() => handleSort('name')}>
                            Name {sortField === 'name' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentEvents.map((event, index) => (
                        <tr key={index}>
                            <td>{new Date(event.timestamp).toLocaleString()}</td>
                            <td>{event.eventId}</td>
                            <td>{event.eventType}</td>
                            <td>{event.status}</td>
                            <td>{event.objectId}</td>
                            <td>{event.type}</td>
                            <td>{event.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="container">
                <div className="row">
                    <Pagination
                        pages={totalPagesNum}
                        setCurrentPage={setCurrentPage}
                        currentItems={currentEvents}
                        items={eventData}
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
                                            value={eventsPerPage}
                                            onChange={(e) => setEventsPerPage(Number(e.target.value))}
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

export default EventsTable;



