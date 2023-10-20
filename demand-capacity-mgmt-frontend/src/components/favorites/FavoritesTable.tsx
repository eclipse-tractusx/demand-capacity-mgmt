/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *    See the NOTICE file(s) distributed with this work for additional
 *    information regarding copyright ownership.
 *
 *    This program and the accompanying materials are made available under the
 *    terms of the Apache License, Version 2.0 which is available at
 *    https://www.apache.org/licenses/LICENSE-2.0.
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *    License for the specific language governing permissions and limitations
 *    under the License.
 *
 *    SPDX-License-Identifier: Apache-2.0
 *    ********************************************************************************
 */
import React from "react";
import { BsStar } from "react-icons/bs";  // Import the BsStar icon

interface FavoritesTableProps<T> {
    data: T[];
    headings: string[];
    renderRow: (item: T, index: number) => JSX.Element[];
    onButtonClick?: (item: T) => void;
}

const FavoritesTable = <T extends {}>({
                                          data,
                                          headings,
                                          renderRow,
                                          onButtonClick
                                      }: FavoritesTableProps<T>) => {
    return (
        <div className='table-responsive table-overflow-control mt-2'>
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Action</th>
                    {headings.map((heading, index) => (
                        <th key={index}>{heading}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                            <button
                                onClick={() => onButtonClick?.(item)}
                                className="btn btn-primary"
                            >
                                <BsStar />  {/* Use the BsStar icon here */}
                            </button>
                        </td>
                        {renderRow(item, index).map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FavoritesTable;

