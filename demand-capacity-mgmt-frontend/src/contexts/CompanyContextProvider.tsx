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
import { CompanyDataProps } from '../interfaces/company_interfaces';
import createAPIInstance from "../util/Api";
import { useUser } from "./UserContext";

interface CompanyContextData {
  fetchCompaniesWithRetry: () => Promise<CompanyDataProps[]>;
  companies: CompanyDataProps[];
  topCompanies: CompanyDataProps[];
  findCompanyByCompanyID: (companyID: string) => CompanyDataProps | undefined;
}

export const CompanyContext = createContext<CompanyContextData | undefined>(undefined);

const CompanyContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const { access_token } = useUser();
  const [companies, setCompanies] = useState<CompanyDataProps[]>([]);
  const [topCompanies, setTopCompanies] = useState<CompanyDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3; //TODO set back to 3
  const api = createAPIInstance(access_token);

  const fetchCompaniesWithRetry = useCallback(async (): Promise<CompanyDataProps[]> => {
    setIsLoading(true);

    try {
      const response = await api.get('/company', {});
      const result: CompanyDataProps[] = await response.data;

      setCompanies((prevCompanies) => [...prevCompanies, ...result]);
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


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/company', {
        });
        const result: CompanyDataProps[] = response.data;
        setCompanies(result);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    const fetchTopCompanies = async (): Promise<CompanyDataProps> => {
      try {
        const response = await api.get(`/company/top`);
        setTopCompanies(response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching top companies:', error);
        throw error;
      }
    };

    fetchCompanies();
    fetchTopCompanies();
  }, [access_token]);



  const findCompanyByCompanyID = (companyID: string | undefined): CompanyDataProps | undefined => {
    return companies.find(company => company.id === companyID);
  };

  const findCompanyNameByBpn = (bpn: string | undefined): string => {
    const companyName = companies.find(company => company.bpn === bpn)?.companyName;
    return companyName || 'N/A';
  };

  return (
    <CompanyContext.Provider value={{ fetchCompaniesWithRetry, companies, topCompanies, findCompanyByCompanyID }}>
      {props.children}
    </CompanyContext.Provider>
  );
};

export default CompanyContextProvider;