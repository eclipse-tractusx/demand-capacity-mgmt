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

import React, { useContext, useMemo, useState } from 'react';
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FaArchive, FaArrowDown, FaArrowUp, FaCopy, FaEnvelope, FaExclamation, FaExternalLinkAlt, FaStar, FaUnlink, FaWrench } from 'react-icons/fa';
import { EventsContext } from '../../contexts/EventsContextProvider';
import { EventProp } from '../../interfaces/event_interfaces';
import Pagination from '../common/Pagination';

interface EventsTableProps {
    events: EventProp[];
}

const EventsTable: React.FC<EventsTableProps> = ({ events }) => {
    const eventsContext = useContext(EventsContext)!;
    const [sortField, setSortField] = useState<string>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [eventsPerPage, setEventsPerPage] = useState<number>(20);

    const eventTypeIcons: { [key: string]: React.ReactNode } = {
        GENERAL_EVENT: <FaEnvelope className="text-primary" size={25} />,
        TODO: <FaWrench className="text-warning" size={25} />,
        ALERT: <FaExclamation className="text-danger" size={25} />,
        STATUS_IMPROVEMENT: <FaArrowUp className="text-success" size={25} />,
        STATUS_REDUCTION: <FaArrowDown className="text-danger" size={25} />,
        LINKED: <FaExternalLinkAlt className="text-info" size={25} />,
        UN_LINKED: <FaUnlink className="text-danger" size={25} />,
    };


    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const sortedData = useMemo(() => {
        const sortedArray = [...events].sort((a, b) => {
            let comparison = 0;
            if (sortField === 'timestamp' && a.timeCreated && b.timeCreated) {
                const dateA = new Date(a.timeCreated).getTime();
                const dateB = new Date(b.timeCreated).getTime();
                comparison = dateB - dateA; // Most recent events first
            } else if (sortField !== 'timestamp' && a[sortField as keyof EventProp] && b[sortField as keyof EventProp]) {
                const fieldA = a[sortField as keyof EventProp] as string;
                const fieldB = b[sortField as keyof EventProp] as string;
                comparison = fieldA.localeCompare(fieldB);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        return sortedArray;
    }, [events, sortField, sortOrder]);

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = sortedData.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPagesNum = Math.ceil(sortedData.length / eventsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const generateOverlay = (event: EventProp): React.ReactElement => {
        const eventTypeIcon = eventTypeIcons[event.eventType];
        if (eventTypeIcon) {
            return (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-event-type-${event.id}`}>{event.eventType}</Tooltip>}
                >
                    <span> {eventTypeIcon}</span>
                </OverlayTrigger>
            );
        }
        return <span>{event.eventType}</span>;
    };




    const handleArchiveClick = async (selectedEvent: EventProp) => {
        eventsContext.archiveLog(selectedEvent);
    };


    return (
        <>
            <div className='table-responsive table-overflow-control mt-2'>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th onClick={() => handleSort('timestamp')}>
                                Timestamp {sortField === 'timestamp' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('eventId')}>
                                Event ID {sortField === 'eventId' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('objectId')}>
                                Object ID {sortField === 'objectId' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('eventType')}>
                                Type {sortField === 'eventType' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('objectType')}>
                                Object Type {sortField === 'objectType' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('eventDescription')}>
                                Description {sortField === 'eventDescription' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('userAccount')}>
                                User {sortField === 'userAccount' ? (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : '-'}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEvents.map((event, index) => (
                            <tr key={index}>
                                <td>{event.isFavorited ? <FaStar className="text-warning" size={25} /> : <FaStar className="text-muted" opacity='0.2' size={25} />}</td>
                                <td>{new Date(event.timeCreated).toLocaleString()}</td>
                                <td><OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-copy-${event.id}`}>{event.id}</Tooltip>}>
                                    <Button
                                        variant="outline-info"
                                        onClick={() => {
                                            // Function to copy the internalId to the clipboard
                                            navigator.clipboard.writeText(event.id);
                                        }}
                                    ><FaCopy />
                                    </Button></OverlayTrigger></td>
                                <td>
                                    {event.capacityGroupId !== "null" || event.materialDemandId !== "null" ? (
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id={`tooltip-copy-${event.id}`}>
                                                    {event.capacityGroupId !== "null" ? event.capacityGroupId : event.materialDemandId}
                                                </Tooltip>
                                            }
                                        >
                                            <Button
                                                variant="outline-info"
                                                onClick={() => {
                                                    // Function to copy the appropriate ID to the clipboard
                                                    const idToCopy = event.capacityGroupId !== "null" ? event.capacityGroupId : event.materialDemandId;
                                                    if (idToCopy !== "null") {
                                                        navigator.clipboard.writeText(idToCopy);
                                                    }
                                                }}
                                            >
                                                <FaCopy />
                                            </Button>
                                        </OverlayTrigger>
                                    ) : '-'}
                                </td>

                                <td>{generateOverlay(event)}</td>
                                <td>{event.objectType}</td>
                                <td>{event.eventDescription}</td>
                                <td>{event.userAccount}</td>
                                <td><Button variant="primary" onClick={() => handleArchiveClick(event)}>
                                    <FaArchive />
                                </Button></td>
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
                        currentItems={currentEvents}
                        items={events}
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



