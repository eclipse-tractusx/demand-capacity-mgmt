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

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from "../interfaces/user_interface";

interface UserContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    refreshToken: string | null;
    accessToken: string | null;
    expiresIn: number | null;
    setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
    setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
    setExpiresIn: React.Dispatch<React.SetStateAction<number | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);
interface UserProviderProps {
    children: React.ReactNode;
}
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const storedUser = localStorage.getItem('user');
    const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);

    const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refreshToken') || null);
    const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken') || null);
    const [expiresIn, setExpiresIn] = useState<number | null>(() => Number(localStorage.getItem('expiresIn')) || null);


    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Storing to sessionStorage when the state changes
    useEffect(() => {
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    }, [refreshToken]);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
    }, [accessToken]);

    useEffect(() => {
        if (expiresIn) {
            localStorage.setItem('expiresIn', expiresIn.toString());
        }
    }, [expiresIn]);

    return (
        <UserContext.Provider value={{ user, setUser, refreshToken, setRefreshToken, accessToken, setAccessToken, expiresIn, setExpiresIn }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}