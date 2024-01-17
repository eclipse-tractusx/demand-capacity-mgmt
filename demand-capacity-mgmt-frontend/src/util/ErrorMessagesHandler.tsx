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

import { ToastContent, toast } from "react-toastify";

interface ErrorMessage {
    objectType: string;
    errorCode: string;
    lastDigits: string;
    message: string;
}

export const errorMessages: ErrorMessage[] = [
    // Material Demand Errors
    { objectType: '1', errorCode: '0', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '1', errorCode: '0', lastDigits: '15', message: 'Failed to update data on the server, try again later.' },
    { objectType: '1', errorCode: '0', lastDigits: '16', message: 'Failed to update data on the server, try again later.' },
    { objectType: '1', errorCode: '0', lastDigits: '90', message: 'Error processing request' },
    { objectType: '1', errorCode: '1', lastDigits: '00', message: 'Error creating material demand.' },
    { objectType: '1', errorCode: '1', lastDigits: '10', message: 'Error creating material demand.' },
    { objectType: '1', errorCode: '1', lastDigits: '11', message: 'Error creating material demand.' },
    { objectType: '1', errorCode: '1', lastDigits: '12', message: 'Error creating material demand.' },
    { objectType: '1', errorCode: '4', lastDigits: '04', message: 'Failed to fetch Material Demand' },
    { objectType: '1', errorCode: '5', lastDigits: '00', message: 'Backend exception, take note of the following timestamp %timestamp%.' },

    // Capacity Group Errors
    { objectType: '2', errorCode: '0', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '2', errorCode: '0', lastDigits: '15', message: 'Failed to update data on the server, try again later.' },
    { objectType: '2', errorCode: '0', lastDigits: '16', message: 'Failed to update data on the server, try again later.' },
    { objectType: '2', errorCode: '1', lastDigits: '00', message: 'Error creating capacity group.' },
    { objectType: '2', errorCode: '1', lastDigits: '10', message: 'Error creating capacity group.' },
    { objectType: '2', errorCode: '1', lastDigits: '11', message: 'Error creating capacity group.' },
    { objectType: '2', errorCode: '1', lastDigits: '12', message: 'Error creating capacity group.' },
    { objectType: '2', errorCode: '4', lastDigits: '04', message: 'Failed to fetch Capacity Group' },
    { objectType: '2', errorCode: '5', lastDigits: '00', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    { objectType: '2', errorCode: '6', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '2', errorCode: '7', lastDigits: '00', message: 'Backend exception, take note of the following timestamp %timestamp%.' },


    // EDC Communication Errors
    { objectType: '3', errorCode: '0', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '3', errorCode: '0', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },

    // Other Contexts Errors
    // Addressbook Errors
    { objectType: '4', errorCode: '1', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '1', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '1', lastDigits: '15', message: 'Failed to update data on the server, try again later.' },
    { objectType: '4', errorCode: '1', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    // Alerts Errors
    { objectType: '4', errorCode: '2', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '2', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '2', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    // Events Errors
    { objectType: '4', errorCode: '3', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '3', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '3', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    { objectType: '4', errorCode: '3', lastDigits: '70', message: 'Error fetching data, try again later' },
    { objectType: '4', errorCode: '3', lastDigits: '71', message: 'Error fetching data, try again later' },
    { objectType: '4', errorCode: '3', lastDigits: '75', message: 'Error fetching data, try again later' },
    { objectType: '4', errorCode: '3', lastDigits: '90', message: 'Error processing request' },
    // Favorite Errors
    { objectType: '4', errorCode: '4', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '4', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '4', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    { objectType: '4', errorCode: '4', lastDigits: '70', message: 'Error fetching data, try again later' },
    // InfoMenu Errors
    { objectType: '4', errorCode: '5', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '5', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    // Company Data Errors
    { objectType: '4', errorCode: '6', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '6', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '6', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
    { objectType: '4', errorCode: '6', lastDigits: '70', message: 'Error fetching top companies, try again later' },
    // Unit of Measure errors
    { objectType: '4', errorCode: '7', lastDigits: '00', message: 'Backend communication timed out, try again later.' },
    { objectType: '4', errorCode: '7', lastDigits: '10', message: 'Failed to push data to the server, try again later.' },
    { objectType: '4', errorCode: '7', lastDigits: '50', message: 'Backend exception, take note of the following timestamp %timestamp%.' },
];


export const customErrorToast = (objectType: string, errorCode: string, lastDigits: string, toastProps?: object): React.ReactText => {
    const fullErrorCode = objectType + errorCode + lastDigits;
    const errorMessage = errorMessages.find((error) => error.objectType === objectType && error.errorCode === errorCode && error.lastDigits === lastDigits);

    if (errorMessage) {
        let formattedMessage = `Error <strong>${fullErrorCode}</strong><br />${errorMessage.message}`;

        // Replace %timestamp% with the current formatted timestamp
        if (formattedMessage.includes('%timestamp%')) {
            const currentTimestamp = new Date();
            formattedMessage = formattedMessage.replace('%timestamp%', `${currentTimestamp}`);
        }

        const toastContent: ToastContent = (
            <div className="error-msg-container" dangerouslySetInnerHTML={{ __html: formattedMessage }} />
        );

        return toast.error(toastContent, {
            ...toastProps
        });
    } else {
        return 'Unknown error occurred, please contact your system administrator.';
    }
};




