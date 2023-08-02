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
import { DemandProp } from '../interfaces/demand_interfaces';


interface DemandPropContextData {
  demandprops: DemandProp[];
}

export const DemandPropContext = createContext<DemandPropContextData | undefined>(undefined);

const DemandPropContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

  const [demandprops, setDemands] = useState<DemandProp[]>([]);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const response = await axios.get('/demand', {
          params: {
            project_id: 1, // Adjust the project ID parameter as needed
          },
        });
        const result: DemandProp[] = response.data;
        setDemands(result);
      } catch (error) {
        console.error('Error fetching demands:', error);
      }
    };
  
    fetchDemands();
  }, []);
  

  return (
    <DemandPropContext.Provider value={{ demandprops }}>
      {props.children}
    </DemandPropContext.Provider>
  );
};

export default DemandPropContextProvider;
