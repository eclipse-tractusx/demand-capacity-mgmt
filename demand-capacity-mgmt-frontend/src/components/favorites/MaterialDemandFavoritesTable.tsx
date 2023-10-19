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

import {FavoriteProp} from "../../interfaces/Favorite_interface";
import React, {useContext} from "react";
import {FavoritesContext} from "../../contexts/FavoritesContextProvider";

interface FavoritesTableProps {
    favorites: FavoriteProp[];
}

const MaterialDemandFavoritesTable: React.FC<FavoritesTableProps> = ({favorites}) => {
    const favoritesContext = useContext(FavoritesContext)!;
    return (
        <>
        <div className='table-responsive table-overflow-control mt-2'>
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>#</th>
                    {Array.from({length: 12}).map((_, index) => (
                        <th key={index}>Table heading</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    {Array.from({length: 12}).map((_, index) => (
                        <td key={index}>Table cell {index}</td>
                    ))}
                </tr>
                <tr>
                    <td>2</td>
                    {Array.from({length: 12}).map((_, index) => (
                        <td key={index}>Table cell {index}</td>
                    ))}
                </tr>
                <tr>
                    <td>3</td>
                    {Array.from({length: 12}).map((_, index) => (
                        <td key={index}>Table cell {index}</td>
                    ))}
                </tr>
                </tbody>
            </table>
        </div>
        </>
    );
};
export default MaterialDemandFavoritesTable;
