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
import { CapacityGroup } from '../interfaces/capacitygroup_interfaces';

interface CapacityGroupContextData {
  capacitygroups: CapacityGroup[];
  deleteCapacityGroup: (id: number) => Promise<void>;
  createCapacityGroup: (newCapacityGroup: CapacityGroup) => Promise<void>;
  updateCapacityGroup: (updatedCapacityGroup: CapacityGroup) => Promise<void>;
}

export const CapacityGroupContext = createContext<CapacityGroupContextData | undefined>(undefined);

const CapacityGroupsProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

  const [capacitygroups, setCapacityGroups] = useState<CapacityGroup[]>([]);

  useEffect(() => {
    const fetchCapacityGroups = async () => {
      try {
        const response = await axios.get('/capacitygroup', {
          params: {
            project_id: 1, // Adjust the project ID parameter as needed
          },
        });
        const result: CapacityGroup[] = response.data;
        setCapacityGroups(result);
      } catch (error) {
        console.error('Error fetching capacitygroups:', error);
      }
    };
  
    fetchCapacityGroups();
  }, []);
  

  const deleteCapacityGroup = async (id: number) => {
    try {
      await axios.delete(`/capacitygroup/${id}`);
      setCapacityGroups((prevCapacityGroups) => prevCapacityGroups.filter((capacitygroup) => capacitygroup.id !== id));
    } catch (error) {
      console.error('Error deleting capacitygroup:', error);
    }
  };

  const createCapacityGroup = async (newCapacityGroup: CapacityGroup) => {
    try {
      const response = await axios.post('/demand', newCapacityGroup);
      const createdDemand: CapacityGroup = response.data;
      setCapacityGroups((prevCapacityGroups) => [...prevCapacityGroups, createdDemand]);
    } catch (error) {
      console.error('Error creating demand:', error);
    }
  };

  const updateCapacityGroup = async (updatedCapacityGroup: CapacityGroup) => {
    try {
      const response = await axios.put(`/demand/${updatedCapacityGroup.id}`, updatedCapacityGroup);
      const modifiedDemand: CapacityGroup = response.data;
      setCapacityGroups((prevCapacityGroups) =>
        prevCapacityGroups.map((demand) => (demand.id === modifiedDemand.id ? modifiedDemand : demand))
      );
    } catch (error) {
      console.error('Error updating demand:', error);
    }
  };

  return ( 
    <CapacityGroupContext.Provider value={{capacitygroups, deleteCapacityGroup, createCapacityGroup, updateCapacityGroup }}>
      {props.children}
    </CapacityGroupContext.Provider>
  );
};

export default CapacityGroupsProvider;
