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
import { FavoriteResponse } from '../interfaces/Favorite_interface';
import createAPIInstance from "../util/Api";
import { useUser } from './UserContext';
import { FavoritePayload,FavoriteType } from  '../interfaces/Favorite_interface';

interface FavoritesContextData {
    favorites: FavoriteResponse | null | undefined;
    fetchFavorites: () => Promise<void>;
    // If you've added a refresh function
    refresh?: () => void;
    addFavorite: (favoriteID: string, fType: FavoriteType) => Promise<void>;
    deleteFavorite: (favoriteID: string) => Promise<void>;
    fetchFavoritesByType: (type: string) => Promise<FavoriteResponse>;
}

export const FavoritesContext = createContext<FavoritesContextData | undefined>(undefined);


const FavoritesContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const [favorites, setFavorites] = useState<FavoriteResponse | undefined>(undefined);

    const { access_token } = useUser();

    const api = createAPIInstance(access_token);

    const fetchFavorites = async () => {
        try {
            const response = await api.get('/favorite');
            console.log('Fetched data:', response.data);
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching event history:', error);
        }
    };

    const fetchFavoritesByType = async (type: string): Promise<FavoriteResponse> => {
        try {
            const response = await api.get(`/favorite/${type}`);
            console.log('Fetched favorites by type:', response.data);
            setFavorites(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching favorites by type:', error);
            throw error;  // Propagate the error to allow handling in calling functions if necessary
        }
    };

    const addFavorite = async (favoriteID: string, fType: FavoriteType) => {
        try {
            const payloadData: FavoritePayload = {
                favoriteId: favoriteID,
                fType: fType
            };
            await api.post('/favorite', payloadData);
        } catch (error) {
            console.log("Error adding to favorites", error);
        }
    }

    const deleteFavorite = async (favoriteID: string) => {
        try {
            await api.delete(`/favorite/${favoriteID}`);
        } catch (error) {
            console.log("Error adding to favorites", error);
        }
    }

    useEffect(() => {
        fetchFavorites();
    }, []);  // Note the empty array, this ensures it runs only once.

    const refresh = () => {
        fetchFavorites();
    };

    const contextValue = {
        favorites,
        fetchFavorites,
        refresh,
        fetchFavoritesByType,
        addFavorite,
        deleteFavorite
    };

    return (
        <FavoritesContext.Provider value={contextValue}>
            {props.children}
        </FavoritesContext.Provider>
    );
}

export default FavoritesContextProvider;