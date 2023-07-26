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

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface Company {
  bpn: string
  companyName: string
  street: string
  number: string
  zipCode: string
  country: string
  myCompany: string
}


interface CompanyContextData {
  companies: Company[];
}

export const CompanyContext = createContext<CompanyContextData | undefined>(undefined);

const CompanyContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/company', {
         
        });
        const result: Company[] = response.data;
        setCompanies(result);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
  
    fetchCompanies();
  }, []);
  


  return (
    <CompanyContext.Provider value={{ companies}}>
      {props.children}
    </CompanyContext.Provider>
  );
};

export default CompanyContextProvider;
