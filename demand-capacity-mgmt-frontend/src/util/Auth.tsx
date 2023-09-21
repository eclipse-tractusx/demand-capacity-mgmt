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

import Api from '../util/Api';
import {User} from "../interfaces/UserInterface";

export const isAuthenticated = async (): Promise<boolean> => {
    try {
        // No need for data or headers, since the cookie will be sent automatically
        const response = await Api.post('http://localhost:8080/token/introspect', null, {
            headers: {
                'Content-Type': 'application/json', // Changed this line
            }
        });
        return response.data.active;
    } catch (error) {
        console.error('Error checking authentication status', error);
        return false;
    }
}



export const login = async (username: string, password: string): Promise<User> => {
    try {
        const requestData = new URLSearchParams();
        requestData.append('username', username);
        requestData.append('password', password);

        const response = await Api.post('/token/login', requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        return response.data; // returning user object
    } catch (error) {
        console.error('Error during login', error);
        throw error;
    }
}


export const logout = async (): Promise<void> => {
    try {
        await Api.post('/token/logout');
    } catch (error) {
        console.error('Error during logout', error);
        throw error;
    }
}

