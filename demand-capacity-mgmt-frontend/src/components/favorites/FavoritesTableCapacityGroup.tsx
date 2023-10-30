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
    FaCopy,
    FaEye
} from 'react-icons/fa';
import { LuStarOff } from "react-icons/lu";
import { FavoritesContext } from "../../contexts/FavoritesContextProvider";
import { SingleCapacityGroupFavoriteResponse } from '../../interfaces/Favorite_interface';
import Pagination from '../common/Pagination';
interface FavoriteTableMaterialDemandsProps {
    favcapacitygroups: SingleCapacityGroupFavoriteResponse[];
}

const FavoritesTableCapacityGroup: React.FC<FavoriteTableMaterialDemandsProps> = ({ favcapacitygroups }) => {
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
        const sortedArray = [...favcapacitygroups].sort((a, b) => {
            let comparison = 0;
            // if (sortField === 'changedAt' && a && b.changedAt) {
            //     const dateA = new Date(a.changedAt).getTime();
            //     const dateB = new Date(b.changedAt).getTime();
            //     comparison = dateB - dateA; // Most recent first
            // } else 
            if (sortField !== 'timestamp' && a[sortField as keyof SingleCapacityGroupFavoriteResponse] && b[sortField as keyof SingleCapacityGroupFavoriteResponse]) {
                const fieldA = a[sortField as keyof SingleCapacityGroupFavoriteResponse] as string;
                const fieldB = b[sortField as keyof SingleCapacityGroupFavoriteResponse] as string;
                comparison = fieldA.localeCompare(fieldB);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        return sortedArray;
    }, [favcapacitygroups, sortField, sortOrder]);

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
        [favcapacitygroups]
    );

    return (
        <>
            <div className='table-responsive table-overflow-control mt-2'>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>
                                Capacity Group Name {sortField === 'timestamp' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th>
                                Customer BPNL  {sortField === 'eventId' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                            <th >
                                Supplier BPNL   {sortField === 'objectId' ? (sortOrder === 'asc' ? <FaArrowUp /> :
                                    <FaArrowDown />) : '-'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {favcapacitygroups.map((cg, index) => (
                            <tr key={index}>
                                <td>
                                    <span className='inlinefav'>
                                        <LuStarOff
                                            opacity={0.7}
                                            color='red'
                                            onClick={() => handleUnfavorite(cg.capacityGroupId)}
                                            size={25}
                                        />
                                    </span>

                                </td>
                                <td>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-copy-${cg.capacityGroupId}`}>Open details</Tooltip>}
                                    >
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => {
                                                const url = `/details/${cg.capacityGroupId}`;
                                                window.open(url, '_blank'); // Opens a new tab with the specified URL
                                            }}
                                        >
                                            <FaEye />
                                        </Button>
                                    </OverlayTrigger>
                                </td>
                                <td>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-copy-${cg.capacityGroupId}`}>{cg.capacityGroupId}</Tooltip>}>
                                        <Button
                                            variant="outline-info"
                                            onClick={() => {
                                                // Function to copy the internalId to the clipboard
                                                navigator.clipboard.writeText(cg.capacityGroupId.toString());
                                            }}
                                        ><FaCopy />
                                        </Button>
                                    </OverlayTrigger>
                                </td>
                                <td>{cg.capacityGroupName}</td>
                                <td>{cg.customer}</td>
                                <td>{cg.supplier}</td>
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
                        items={favcapacitygroups}
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

export default FavoritesTableCapacityGroup;



