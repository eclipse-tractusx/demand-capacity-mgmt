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


import React, { createContext, useEffect, useState } from 'react';
import { FavoriteProp } from '../interfaces/Favorite_interface';
import createAPIInstance from "../util/Api";
import { useUser } from './UserContext';

interface FavoritesContextData{
    favorites: FavoriteProp[],
    fetchFavorites : () => Promise<void>;
}
export const FavoritesContext = createContext<FavoritesContextData | undefined>(undefined);

const FavoritesContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

    const { access_token } = useUser();
    const [favorites, setFavorites] = useState<FavoriteProp[]>([]);

    const fetchFavorites = async () => {
        try {
            const api = createAPIInstance(access_token);
            const response = await api.get('/favorites');
            const result: FavoriteProp[] = response.data;
            setFavorites(result);
        } catch (error) {
            console.error('Error fetching event history:', error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [access_token]);

    return (
        <FavoritesContext.Provider value={{ favorites, fetchFavorites }}>
            {props.children}
        </FavoritesContext.Provider>
    );
}

export default FavoritesContextProvider;