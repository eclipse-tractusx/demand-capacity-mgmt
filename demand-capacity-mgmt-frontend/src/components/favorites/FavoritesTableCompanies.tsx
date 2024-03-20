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
    FaCopy
} from 'react-icons/fa';
import { LuStarOff } from "react-icons/lu";
import { FavoritesContext } from "../../contexts/FavoritesContextProvider";
import { CompanyDtoFavoriteResponse } from '../../interfaces/favorite_interfaces';
import Pagination from '../common/Pagination';
interface FavoriteTableCompaniesProps {
    favcompanies: CompanyDtoFavoriteResponse[];
}

const FavoriteTableCompanies: React.FC<FavoriteTableCompaniesProps> = ({ favcompanies }) => {
    const [sortField] = useState<string>('changedAt');
    const [sortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [eventsPerPage, setEventsPerPage] = useState<number>(5);

    const { deleteFavorite, fetchFavorites } = useContext(FavoritesContext)!;

    const sortedData = useMemo(() => {
        const sortedArray = [...favcompanies].sort((a, b) => {
            let comparison = 0;
            if (sortField !== 'changedAt' && a[sortField as keyof CompanyDtoFavoriteResponse] && b[sortField as keyof CompanyDtoFavoriteResponse]) {
                const fieldA = a[sortField as keyof CompanyDtoFavoriteResponse];
                const fieldB = b[sortField as keyof CompanyDtoFavoriteResponse];
                comparison = fieldA.localeCompare(fieldB);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        return sortedArray;
    }, [favcompanies, sortField, sortOrder]);

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
        [deleteFavorite, fetchFavorites]
    );

    return (
        <>
            <div className='table-responsive table-overflow-control mt-2'>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th> Company BPN</th>
                            <th> Company Name</th>
                            <th> Company Country</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favcompanies.map((companies, index) => (
                            <tr key={index}>
                                <td>
                                    <span className='inlinefav'>
                                        <LuStarOff
                                            opacity={0.7}
                                            color='red'
                                            onClick={() => handleUnfavorite(companies.id)}
                                            size={25}
                                        />
                                    </span>

                                </td>
                                <td>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-copy-${companies.id}`}>{companies.id}</Tooltip>}>
                                        <Button
                                            variant="outline-info"
                                            onClick={() => {
                                                // Function to copy the internalId to the clipboard
                                                navigator.clipboard.writeText(companies.id.toString());
                                            }}
                                        ><FaCopy />
                                        </Button></OverlayTrigger>
                                </td>
                                <td>{companies.bpn}</td>
                                <td>{companies.companyName}</td>
                                <td>{companies.country}</td>
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
                        items={sortedData}
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

export default FavoriteTableCompanies;



