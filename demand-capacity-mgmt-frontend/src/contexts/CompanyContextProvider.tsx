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

import React, { createContext, useEffect, useState } from 'react';
import { CompanyData } from '../interfaces/company_interfaces';
import createAPIInstance from "../util/Api";
import { useUser } from "./UserContext";

interface CompanyContextData {
  companies: CompanyData[];
  topCompanies: CompanyData[];
  findCompanyByCompanyID: (companyID: string) => CompanyData;
}

export const CompanyContext = createContext<CompanyContextData | undefined>(undefined);

const CompanyContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const { access_token } = useUser();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [topCompanies, setTopCompanies] = useState<CompanyData[]>([]);
  const api = createAPIInstance(access_token);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/company', {
        });
        const result: CompanyData[] = response.data;
        setCompanies(result);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    const fetchTopCompanies = async (): Promise<CompanyData> => {
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
    <CompanyContext.Provider value={{ companies, topCompanies, findCompanyByCompanyID }}>
      {props.children}
    </CompanyContext.Provider>
  );
};

export default CompanyContextProvider;