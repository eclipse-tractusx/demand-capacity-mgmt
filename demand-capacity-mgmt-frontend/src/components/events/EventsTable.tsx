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

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Col, Dropdown, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import {
    FaArchive,
    FaArrowDown,
    FaArrowUp,
    FaCopy,
    FaEllipsisV,
    FaTrashAlt,
    FaUndo
} from 'react-icons/fa';
import { LuStar } from 'react-icons/lu';
import { EventsContext } from '../../contexts/EventsContextProvider';
import { FavoritesContext } from "../../contexts/FavoritesContextProvider";
import { EventProp, eventTypeIcons } from '../../interfaces/event_interfaces';
import { EventFavoriteResponse, FavoriteType } from "../../interfaces/favorite_interface";
import DangerConfirmationModal, { ConfirmationAction } from '../common/DangerConfirmationModal';
import Pagination from '../common/Pagination';

interface EventsTableProps {
    events: EventProp[];
    isArchive: boolean
}

const EventsTable: React.FC<EventsTableProps> = ({ events, isArchive }) => {
    const eventsContext = useContext(EventsContext)!;
    const [sortField, setSortField] = useState<string>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [eventsPerPage, setEventsPerPage] = useState<number>(20);

    const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction>(ConfirmationAction.Delete);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const { deleteEventId, deleteArchivedEventId } = useContext(EventsContext)!;
    const { addFavorite, fetchFavoritesByType, deleteFavorite } = useContext(FavoritesContext)!;
    const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);

    const fetchFavorites = async () => {
        try {
            const favorites = await fetchFavoritesByType(FavoriteType.EVENT);
            console.log(favorites)
            if (favorites && favorites.events) {
                setFavoriteEvents(favorites.events.map((fav: EventFavoriteResponse) => fav.logID));
            }
        } catch (error) {
            console.error('Error fetching favorites by type in DemandList:', error);
        }
    };

    const toggleFavorite = async (favoriteEventLogID: string) => {
        if (favoriteEvents.includes(favoriteEventLogID)) {
            await deleteFavorite(favoriteEventLogID)
            setFavoriteEvents(prev => prev.filter(id => id !== favoriteEventLogID));
        } else {
            await addFavorite(favoriteEventLogID, FavoriteType.EVENT)
            setFavoriteEvents(prev => [...prev, favoriteEventLogID]);
        }
        fetchFavorites();
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [events]);

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

    const handleDeleteEvent = useCallback(
        async (id: string) => {
            try {
                if (isArchive) {
                    await deleteArchivedEventId(id);
                    eventsContext.fetchArchiveEvents();
                } else {
                    await deleteEventId(id);
                    eventsContext.fetchEvents();
                }


            } catch (error) {
                console.error('Error deleting event:', error);
            }
        },
        [deleteArchivedEventId, deleteEventId, isArchive, eventsContext]
    );

    const handleDeleteButtonClick = (id: string) => {
        setDeleteItemId(id);
        setConfirmationAction(ConfirmationAction.Delete); // Set the confirmation action type
        setShowDeleteConfirmation(true);
    };


    const handleDeleteEventWrapper = () => {
        if (deleteItemId) {
            handleDeleteEvent(deleteItemId)
                .finally(() => {
                    // Close the delete confirmation modal
                    setShowDeleteConfirmation(false);
                    setDeleteItemId(null);
                });
        }
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
                                Timestamp {sortField === 'timestamp' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('eventId')}>
                                Event ID {sortField === 'eventId' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('objectId')}>
                                Object ID {sortField === 'objectId' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('eventType')}>
                                Type {sortField === 'eventType' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('objectType')}>
                                Object Type {sortField === 'objectType' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('eventDescription')}>
                                Description {sortField === 'eventDescription' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th onClick={() => handleSort('userAccount')}>
                                User {sortField === 'userAccount' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEvents.map((event, index) => (
                            <tr key={index}>
                                <td>
                                    {!isArchive && (
                                        <span className='inlinefav'>
                                            <LuStar
                                                className={favoriteEvents.includes(event.logID) ? "text-warning" : "text-muted"}
                                                opacity={favoriteEvents.includes(event.logID) ? "1" : "0.2"}
                                                onClick={() => toggleFavorite(event.logID)}
                                                size={25}
                                            />
                                        </span>
                                    )}

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
                                                        navigator.clipboard.writeText(idToCopy.toString());
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
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" id={`dropdown-menu-${event.id}`}>
                                            <span><FaEllipsisV /></span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {isArchive ? (
                                                <Dropdown.Item onClick={() => handleDeleteButtonClick(event.id.toString())}>
                                                    <FaUndo className='text-muted' /> Unarchive
                                                </Dropdown.Item>
                                            ) : (
                                                <Dropdown.Item onClick={() => handleArchiveClick(event)}>
                                                    <FaArchive className='text-muted' /> Archive
                                                </Dropdown.Item>
                                            )}
                                            <Dropdown.Item onClick={() => {
                                                navigator.clipboard.writeText(event.id.toString())
                                            }}><FaCopy /> Copy ID</Dropdown.Item>
                                            {isArchive ? null : (
                                                <Dropdown.Item className="red-delete-item"
                                                    onClick={() => handleDeleteButtonClick(event.id.toString())}>
                                                    <FaTrashAlt /> Delete
                                                </Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </td>
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
            <DangerConfirmationModal
                show={showDeleteConfirmation}
                onCancel={() => {
                    setShowDeleteConfirmation(false);
                    setDeleteItemId(null);
                }}
                onConfirm={handleDeleteEventWrapper}
                action={confirmationAction}
            />
        </>
    );
};

export default EventsTable;



