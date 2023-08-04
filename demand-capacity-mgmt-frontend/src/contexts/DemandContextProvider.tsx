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
import { Demand } from '../interfaces/demand_interfaces';


interface DemandContextData {
  demands: Demand[];
  deleteDemand: (id: string) => Promise<void>;
  createDemand: (newDemand: Demand) => Promise<void>;
  updateDemand: (updatedDemand: Demand) => Promise<void>;
}

export const DemandContext = createContext<DemandContextData | undefined>(undefined);

const DemandContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

  const [demands, setDemands] = useState<Demand[]>([]);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const response = await axios.get('/demand', {
          params: {
            project_id: 1, // Adjust the project ID parameter as needed
          },
        });
        const result: Demand[] = response.data;
        setDemands(result);
      } catch (error) {
        console.error('Error fetching demands:', error);
      }
    };
  
    fetchDemands();
  }, []);
  

  const deleteDemand = async (id: string) => {
    try {
      await axios.delete(`/demand/${id}`);
      setDemands((prevDemands) => prevDemands.filter((demand) => demand.id !== id));
    } catch (error) {
      console.error('Error deleting demand:', error);
    }
  };

  const createDemand = async (newDemand: Demand) => {
    try {
      console.log(newDemand);
      const response = await axios.post('/demand', newDemand);
      const createdDemand: Demand = response.data;
      setDemands((prevDemands) => [...prevDemands, createdDemand]);
    } catch (error) {
      console.error('Error creating demand:', error);
    }
  };

  const updateDemand = async (updatedDemand: Demand) => {
    try {
      const response = await axios.put(`/demand/${updatedDemand.id}`, updatedDemand);
      const modifiedDemand: Demand = response.data;
      setDemands((prevDemands) =>
        prevDemands.map((demand) => (demand.id === modifiedDemand.id ? modifiedDemand : demand))
      );
    } catch (error) {
      console.error('Error updating demand:', error);
    }
  };

  return (
    <DemandContext.Provider value={{ demands, deleteDemand, createDemand, updateDemand }}>
      {props.children}
    </DemandContext.Provider>
  );
};

export default DemandContextProvider;
