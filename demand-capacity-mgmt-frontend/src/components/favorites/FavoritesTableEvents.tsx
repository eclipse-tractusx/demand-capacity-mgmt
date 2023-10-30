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

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import {
    FaArrowDown,
    FaArrowUp,
    FaCopy
} from 'react-icons/fa';
import { LuStarOff } from "react-icons/lu";
import { FavoritesContext } from "../../contexts/FavoritesContextProvider";
import { eventTypeIcons } from '../../interfaces/event_interfaces';
import { EventFavoriteResponse } from '../../interfaces/Favorite_interface';
import Pagination from '../common/Pagination';
interface FavoriteTableEventsProps {
    events: EventFavoriteResponse[];
}

const FavoritesTableEvents: React.FC<FavoriteTableEventsProps> = ({ events }) => {
    const [sortField, setSortField] = useState<string>('changedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [eventsPerPage, setEventsPerPage] = useState<number>(5);

    const { deleteFavorite, fetchFavorites } = useContext(FavoritesContext)!;

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
            if (sortField === 'changedAt' && a.timeCreated && b.timeCreated) {
                const dateA = new Date(a.timeCreated).getTime();
                const dateB = new Date(b.timeCreated).getTime();
                comparison = dateB - dateA; // Most recent first
            } else if (sortField !== 'timestamp' && a[sortField as keyof EventFavoriteResponse] && b[sortField as keyof EventFavoriteResponse]) {
                const fieldA = a[sortField as keyof EventFavoriteResponse] as string;
                const fieldB = b[sortField as keyof EventFavoriteResponse] as string;
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

    const handleUnfavorite = useCallback(
        async (id: string) => {
            try {
                await deleteFavorite(id)
                fetchFavorites();
            } catch (error) {
                console.error('Error Unfavoriting:', error);
            }
        },
        [events]
    );

    const generateOverlay = (event: EventFavoriteResponse): React.ReactElement => {
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

    return (
        <>
            <div className='table-responsive table-overflow-control mt-2'>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th onClick={() => handleSort('timeCreated')}>
                                Timestamp {sortField === 'timeCreated' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th>
                                Event ID {sortField === 'id' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th >
                                Type {sortField === 'eventType' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th>
                                Description {sortField === 'eventDescription' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th >
                                User {sortField === 'userAccount' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={index}>
                                <td>
                                    <span className='inlinefav'>
                                        <LuStarOff
                                            opacity={0.7}
                                            color='red'
                                            onClick={() => handleUnfavorite(event.logID)}
                                            size={25}
                                        />
                                    </span>

                                </td>
                                <td>{new Date(event.timeCreated).toLocaleString()}</td>
                                <td><OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-copy-${event.id}`}>{event.id}</Tooltip>}>
                                    <Button
                                        variant="outline-info"
                                        onClick={() => {
                                            // Function to copy the internalId to the clipboard
                                            navigator.clipboard.writeText(event.id.toString());
                                        }}
                                    ><FaCopy />
                                    </Button></OverlayTrigger></td>
                                <td>{generateOverlay(event)}</td>
                                <td>{event.description}</td>
                                <td>{event.userAccount}</td>
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
                        currentItems={sortedData}
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

export default FavoritesTableEvents;



