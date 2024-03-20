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
import { CompanyData } from '../interfaces/company_interfaces';
import createAPIInstance from "../util/Api";
import { customErrorToast } from '../util/ErrorMessagesHandler';
import { is404Error, isAxiosError, isTimeoutError } from '../util/TypeGuards';
import { useUser } from "./UserContext";

interface CompanyContextData {
  companies: CompanyData[];
  topCompanies: CompanyData[];
  getCompanybyId: (companyID: string) => Promise<CompanyData | undefined>; // Update return type
  findCompanyByCompanyID: (companyID: string) => CompanyData;
  findCompanyByBpn: (companyBpn: string) => CompanyData;
}


export const CompanyContext = createContext<CompanyContextData | undefined>(undefined);

const CompanyContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const { access_token } = useUser();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [topCompanies, setTopCompanies] = useState<CompanyData[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const api = createAPIInstance(access_token);

  const objectType = '4';
  const errorCode = '6';


  const fetchCompaniesWithRetry = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get('/company', {});
      const result: CompanyData[] = await response.data;

      setCompanies((prevCompanies) => [...prevCompanies, ...result]);
    } catch (error) {

      if (retryCount < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
        setRetryCount((prevRetryCount) => prevRetryCount + 1);
      } else {
        setRetryCount(0);
        customErrorToast(objectType, errorCode, '00')
      }
    }
  }, [retryCount, setCompanies, setRetryCount, api]);

  const getCompanybyId = async (id: string): Promise<CompanyData | undefined> => {
    try {
      const response = await api.get(`/demand/${id}`);
      return response.data;
    } catch (error) {
      if (isTimeoutError(error)) {
        // This is a timeout error
        customErrorToast(objectType, errorCode, '00')
      } else if (is404Error(error) && error.response && error.response.status === 404) {
        // This is a 404 Internal Server Error
        customErrorToast(objectType, errorCode, '40')
      } else if (isAxiosError(error) && error.response && error.response.status === 500) {
        // This is a 500 Internal Server Error
        customErrorToast(objectType, errorCode, '50')
      } else {
        // Handle other types of errors
        customErrorToast('5', '0', '0') //This will trigger, Unkown error
      }
    }
  };

  const fetchTopCompanies = async (): Promise<void> => {
    try {
      const response = await api.get(`/company/top`);
      setTopCompanies(response.data);
      return response.data;
    } catch (error) {
      customErrorToast(objectType, errorCode, '70')
    }
  };

  useEffect(() => {
    fetchCompaniesWithRetry();
    fetchTopCompanies();
  }, [access_token]);// eslint-disable-line react-hooks/exhaustive-deps



  const findCompanyByBpn = (companyBpn: string): CompanyData => {
    const foundCompany = companies.find(company => company.bpn === companyBpn);
    return foundCompany || {
      id: '',
      companyName: '',
      bpn: '',
      street: '',
      zipCode: '',
      country: '',
      number: '',
      contacts: [],
      bpnType: '',
      edc_url: '',
      isEdcRegistered: false,
    };
  };
  const findCompanyByCompanyID = (companyID: string): CompanyData => {
    const foundCompany = companies.find(company => company.id === companyID);
    return foundCompany || {
      id: '',
      companyName: '',
      bpn: '',
      street: '',
      zipCode: '',
      country: '',
      number: '',
      contacts: [],
      bpnType: '',
      edc_url: '',
      isEdcRegistered: false,
    };
  };

  return (
    <CompanyContext.Provider value={{ companies, topCompanies, findCompanyByCompanyID, getCompanybyId, findCompanyByBpn }}>
      {props.children}
    </CompanyContext.Provider>
  );
};

export default CompanyContextProvider;