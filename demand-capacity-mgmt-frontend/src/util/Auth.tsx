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

import qs from 'qs';
import Api from '../util/Api';
const TOKEN_KEY = 'auth_token';

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
}

export const login = async (username: string, password: string): Promise<void> => {
    try {
        const requestData = qs.stringify({ username, password });
        const response = await Api.post('/token/login', requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const { access_token } = response.data;
        localStorage.setItem(TOKEN_KEY, access_token);
    } catch (error) {
        console.error('Error during login', error);
        throw error;
    }
}

export const logout = async (): Promise<void> => {
    try {
        await Api.post('/token/logout');
        localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error during logout', error);
        throw error;
    }
}
