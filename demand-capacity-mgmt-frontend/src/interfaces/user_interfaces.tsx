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

export interface User {
    userID: string;
    name: string;
    lastName: string;
    email: string;
    username: string;
    companyID: string;
    role: string;
    access_token: string;
    refresh_token: string;
    expiresIn: number;
}

export function getUserGreeting(user: User | null): string {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    if (user) {
        if (hours < 12) {
            return `Good morning, ${getUserName(user)}`;
        } else if (hours < 18) {
            return `Good afternoon, ${getUserName(user)}`;
        } else {
            return `Good evening, ${getUserName(user)}`;
        }
    } else {
        // Handle the case when user is null
        return 'Welcome!';
    }
}

export function getUserName(user: User | null): string {
    if (user?.name && user.lastName) {
        if (user.lastName.length <= 6) {
            return `${user.name.charAt(0).toUpperCase()}${user.name.slice(1)} ${user.lastName.charAt(0).toUpperCase()}${user.lastName.slice(1)}`;
        } else {
            return `${user.name.charAt(0).toUpperCase()}${user.name.slice(1)}.${user.lastName.charAt(0).toUpperCase()}`;
        }
    } else if (user?.name) {
        return `${user.name.charAt(0).toUpperCase()}${user.name.slice(1)}`;
    } else if (user?.username) {
        return user.username.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index === 0 ? letter.toUpperCase() : letter.toLowerCase());
    }
    return '';
}

