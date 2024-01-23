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

import React, { createContext, useCallback, useState } from 'react';
import {
    AddressBookCreateProps,
    AddressBookProps
} from "../interfaces/addressbook_interfaces";
import createAPIInstance from "../util/Api";
import { customErrorToast } from '../util/ErrorMessagesHandler';
import { useUser } from './UserContext';


interface AddressBookContextData {
    addressBooks: AddressBookProps[];
    fetchAddressBookWithRetry: () => Promise<AddressBookProps[]>;
    isLoading: boolean;
    createAddressBook: (newAddressBook: AddressBookCreateProps) => Promise<AddressBookProps | undefined>;
    updateAddressBook: (companyId: string, newAddressBook: AddressBookCreateProps) => Promise<AddressBookProps | undefined>;
    getAddressBooksByCompanyId: (companyId: string) => AddressBookProps[];
}

export const AddressBookContext = createContext<AddressBookContextData | undefined>(undefined);


const AddressBookProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const { access_token } = useUser();
    const [addressBooks, setAddressBooks] = useState<AddressBookProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;
    const api = createAPIInstance(access_token);

    const objectType = '4';
    const errorCode = '1';

    const fetchAddressBookWithRetry = useCallback(async (): Promise<AddressBookProps[]> => {
        setIsLoading(true);

        try {
            const response = await api.get('/addressBook', {});
            const result: AddressBookProps[] = await response.data;
            setAddressBooks(result);
            return result;
        } catch (error) {
            if (retryCount < maxRetries - 1) {
                // If not the last retry, delay for 30 seconds before the next retry
                await new Promise((resolve) => setTimeout(resolve, 30000));
                setRetryCount(retryCount + 1); // Increment the retry count
            } else {
                // If the last retry failed, do not retry further
                customErrorToast(objectType, errorCode, '00')
                setRetryCount(0); // Reset the retry count
            }
        } finally {
            // Set isLoading to false regardless of success or failure
            setIsLoading(false);
        }
        return [];
    }, [retryCount, setAddressBooks, setIsLoading, setRetryCount, api]);

    const createAddressBook = async (newAddressBook: AddressBookCreateProps): Promise<AddressBookProps | undefined> => {
        try {
            const api = createAPIInstance(access_token);
            const response = await api.post('/addressBook', newAddressBook);
            fetchAddressBookWithRetry();
            return response.data;
        } catch (error) {
            customErrorToast(objectType, errorCode, '10')
        }
    };


    const updateAddressBook = async (adressbookId: String, newAddressBook: AddressBookCreateProps): Promise<AddressBookProps | undefined> => {
        try {
            const api = createAPIInstance(access_token);
            const response = await api.put(`/addressBook/${adressbookId}`, newAddressBook);
            console.log(newAddressBook);
            fetchAddressBookWithRetry();
            return response.data;
        } catch (error) {
            customErrorToast(objectType, errorCode, '15')
        }
    };

    const getAddressBooksByCompanyId = (companyId: string): AddressBookProps[] => {
        return addressBooks.filter((addressBook) => addressBook.companyId === companyId);
    };

    return (
        <AddressBookContext.Provider value={{ addressBooks, fetchAddressBookWithRetry, isLoading, createAddressBook, updateAddressBook, getAddressBooksByCompanyId }}>
            {props.children}
        </AddressBookContext.Provider>
    );
};
export default AddressBookProvider;
