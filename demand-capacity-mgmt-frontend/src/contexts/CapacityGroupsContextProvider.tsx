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
import {CapacityGroup, SingleCapacityGroup} from '../interfaces/capacitygroup_interfaces';
import api from '../util/Api';


interface CapacityGroupContextData {
  capacitygroups: CapacityGroup[];
  getCapacityGroupById: (id: string) =>Promise<SingleCapacityGroup | undefined>;
}

export const CapacityGroupContext = createContext<CapacityGroupContextData | undefined>(undefined);

const CapacityGroupsProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

  const [capacitygroups, setCapacityGroups] = useState<CapacityGroup[]>([]);

  useEffect(() => {
    const fetchCapacityGroups = async () => {
      try {
        const response = await api.get('/capacityGroup', {});
        const result: CapacityGroup[] = response.data;
        setCapacityGroups(result);
      } catch (error) {
        console.error('Error fetching capacitygroups:', error);
      }
    };
  
    fetchCapacityGroups();
  }, []);

  const getCapacityGroupById = async (id: string): Promise<SingleCapacityGroup | undefined> => {
    try {
      const response = await api.get(`/capacityGroup/${id}`);
      const fetchedCapacityGroup: SingleCapacityGroup = response.data;
      return fetchedCapacityGroup;
    } catch (error) {
      console.error('Error fetching CapacityGroup by id:', error);
      return undefined;
    }
  };

  return (
      <CapacityGroupContext.Provider value={{capacitygroups, getCapacityGroupById}}>
        {props.children}
      </CapacityGroupContext.Provider>
  );
};








    export default CapacityGroupsProvider;
