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

import React, { createContext, useCallback, useEffect, useState } from 'react';
import createAPIInstance from "../util/Api";
import { useUser } from './UserContext';
import {
    AddressBookProps,
    AddressBookCreateProps,
    CompanyCreate,
    CompanyDataProps
} from "../interfaces/addressbook_interfaces";
import {FavoriteResponse} from "../interfaces/favorite_interfaces";


interface AddressBookContextData {
    companies: CompanyDataProps[];
    addressBooks: AddressBookProps[];
    fetchCompaniesWithRetry: () => Promise<CompanyDataProps[]>; // Fix the return type here
    fetchAddressBookWithRetry: () => Promise<AddressBookProps[]>;
    isLoading: boolean;
    createCompany: (newCompany: CompanyCreate) => Promise<CompanyDataProps | undefined>;
    createAddressBook: (newAddressBook: AddressBookCreateProps) => Promise<AddressBookProps | undefined>;
    updateAddressBook: (companyId:string, newAddressBook: AddressBookCreateProps) => Promise<AddressBookProps | undefined>;
}

export const AddressBookContext = createContext<AddressBookContextData | undefined>(undefined);


const AddressBookProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const { access_token } = useUser();
    const [companies, setCompanies] = useState<CompanyDataProps[]>([]);
    const [addressBooks, setAddressBooks] = useState<AddressBookProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;
    const api = createAPIInstance(access_token);


    const fetchCompaniesWithRetry = useCallback(async (): Promise<CompanyDataProps[]> =>{
        setIsLoading(true);

        try {
            const response = await api.get('/company', {});
            const result: CompanyDataProps[] = await response.data;

            setCompanies((prevCompanies) => [...prevCompanies, ...result]);
            await fetchAddressBookWithRetry();
            return result;
        } catch (error) {
            console.error(`Error fetching companies (Retry ${retryCount + 1}):`, error);

            if (retryCount < maxRetries - 1) {
                await new Promise((resolve) => setTimeout(resolve, 30000));
                setRetryCount((prevRetryCount) => prevRetryCount + 1);
            } else {
                setRetryCount(0);
            }
        } finally {
            setIsLoading(false);
        }
        return [];
    }, [retryCount, setCompanies, setIsLoading, setRetryCount, api]);

    const fetchAddressBookWithRetry = useCallback(async  (): Promise<AddressBookProps[]> => {
        setIsLoading(true);

        try {
            const response = await api.get('/addressBook', {});
            const result: AddressBookProps[] = await response.data;
            setAddressBooks(result);
            return result;
        } catch (error) {
            console.error(`Error fetching Address Books (Retry ${retryCount + 1}):`, error);

            if (retryCount < maxRetries - 1) {
                // If not the last retry, delay for 30 seconds before the next retry
                await new Promise((resolve) => setTimeout(resolve, 30000));
                setRetryCount(retryCount + 1); // Increment the retry count
            } else {
                // If the last retry failed, do not retry further
                setRetryCount(0); // Reset the retry count
            }
        } finally {
            // Set isLoading to false regardless of success or failure
            setIsLoading(false);
        }
        return [];
    }, [retryCount, setAddressBooks, setIsLoading, setRetryCount, api]);

    const createCompany = async (newCompany: CompanyCreate): Promise<CompanyDataProps | undefined> => {
        try {
            const api = createAPIInstance(access_token);
            const response = await api.post('/comppany', newCompany);
            return response.data;
        } catch (error) {
            console.error('Error creating company:', error);
        }
    };

    const createAddressBook = async (newAddressBook: AddressBookCreateProps): Promise<AddressBookProps | undefined> => {
        try {
            const api = createAPIInstance(access_token);
            const response = await api.post('/addressBook', newAddressBook);
            return response.data;
        } catch (error) {
            console.error('Error creating address book:', error);
        }
    };

    const updateAddressBook = async (companyId: String,newAddressBook: AddressBookCreateProps): Promise<AddressBookProps | undefined> => {
        try {
            const api = createAPIInstance(access_token);
            const response = await api.put('/addressBook/${companyId}', newAddressBook);
            return response.data;
        } catch (error) {
            console.error('Error creating address book:', error);
        }
    };



    return (
        <AddressBookContext.Provider value={{ companies, addressBooks, fetchCompaniesWithRetry, fetchAddressBookWithRetry, isLoading , createCompany, createAddressBook,updateAddressBook }}>
            {props.children}
        </AddressBookContext.Provider>
    );
};
export default AddressBookProvider;
