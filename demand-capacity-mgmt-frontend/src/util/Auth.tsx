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

import { User } from "../interfaces/user_interface";
import AuthApi from '../util/AuthApi';

export const isAuthenticated = async (refreshToken: string | null): Promise<boolean> => {
    if (!refreshToken) {
        return false;
    }

    try {
        const requestData = new URLSearchParams();
        requestData.append('refresh_token', refreshToken);
        const response = await AuthApi.post('http://localhost:8080/token/introspect', requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        return response.data.active;
    } catch (error) {
        return false;
    }
}

export const login = async (username: string,
    password: string,
    setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>,
    setAccessToken: React.Dispatch<React.SetStateAction<string | null>>,
    setExpiresIn: React.Dispatch<React.SetStateAction<number | null>>): Promise<User> => {
    try {
        const requestData = new URLSearchParams();
        requestData.append('username', username);
        requestData.append('password', password);

        const response = await AuthApi.post('/token/login', requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        setRefreshToken(response.data.refreshToken);
        setAccessToken(response.data.accessToken);
        setExpiresIn(response.data.expiresIn);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const logout = async (refreshToken: string | null): Promise<String> => {
    try {
        const requestData = new URLSearchParams();
        if (refreshToken) {
            requestData.append('refresh_token', refreshToken);
            const response = await AuthApi.post('/token/logout', requestData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            return response.data;
        } else {
            throw new Error('Refresh token is missing.');
        }
    } catch (error) {
        throw error;
    }
}

