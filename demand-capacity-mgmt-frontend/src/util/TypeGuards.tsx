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

import { AxiosError } from "axios";

// Type guards
export const isTimeoutError = (error: unknown): error is Error & { code?: string } => {
    return typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'ECONNABORTED';
};

export const is404Error = (error: unknown): error is AxiosError => {
    return (
        isAxiosError(error) &&
        error.response !== undefined &&
        error.response.status !== undefined &&
        error.response.status === 404
    );
};

export const isAxiosError = (error: unknown): error is AxiosError => {
    return typeof error === 'object' && error !== null && 'isAxiosError' in error && (error as AxiosError).isAxiosError === true;
};