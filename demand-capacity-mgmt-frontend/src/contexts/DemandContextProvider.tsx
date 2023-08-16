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
import React, { createContext, useState, useEffect,useCallback} from 'react';
import axios from 'axios';
import { Demand, DemandProp } from '../interfaces/demand_interfaces';


interface DemandContextData {
  demandprops: DemandProp[];
  createDemand: (newDemand: Demand) => Promise<void>;
  getDemandbyId: (id: string) =>Promise<DemandProp | undefined>;
  deleteDemand: (id: string) => Promise<void>;
  updateDemand: (updatedDemand: Demand) => Promise<void>;
  fetchDemandProps: () => void;

}

export const DemandContext = createContext<DemandContextData | undefined>(undefined);

const DemandContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

  const [demands, setDemands] = useState<Demand[]>([]);
  const [demandprops, setDemandProps] = useState<DemandProp[]>([]);

  const fetchDemandProps = useCallback(async () => {
    try {
      const response = await axios.get('/demand', {
        params: {
          project_id: 1, // Adjust the project ID parameter as needed
        },
      });
      const result: DemandProp[] = response.data;
      setDemandProps(result);
      console.log(demands)// todo clean
    } catch (error) {
      console.error('Error fetching demands:', error);
    }
  }, []);

  useEffect(() => {
    fetchDemandProps();
  }, [fetchDemandProps]);
  

  const getDemandbyId = async (id: string): Promise<DemandProp | undefined> => {
    try {
      const response = await axios.get(`/demand/${id}`);
      const fetchedDemand: DemandProp = response.data;
      return fetchedDemand;
    } catch (error) {
      console.error('Error fetching demand by id:', error);
      return undefined;
    }
  };

  const deleteDemand = async (id: string) => {
    try {
      await axios.delete(`/demand/${id}`);
      setDemandProps((prevDemands) => prevDemands.filter((demand) => demand.id !== id));
    } catch (error) {
      console.error('Error deleting demand:', error);
    }
  };

  const createDemand = async (newDemand: Demand) => {
    try {
      console.log(newDemand);
      const response = await axios.post('/demand', newDemand);
      console.log(response) //todo clean
      fetchDemandProps();
    } catch (error) {
      console.error('Error creating demand:', error);
    }
  };

  const updateDemand = async (updatedDemand: Demand) => {
    try {
      console.log(updatedDemand);
      const response = await axios.put(`/demand/${updatedDemand.id}`, updatedDemand);
      const modifiedDemand: Demand = response.data;
      setDemands((prevDemands) =>
        prevDemands.map((demand) => (demand.id === modifiedDemand.id ? modifiedDemand : demand))
      );
      fetchDemandProps();
    } catch (error) {
      console.error('Error updating demand:', error);
    }
  };

  return (
    <DemandContext.Provider value={{ demandprops, deleteDemand, createDemand, updateDemand, getDemandbyId,fetchDemandProps }}>
      {props.children}
    </DemandContext.Provider>
  );
};

export default DemandContextProvider;
