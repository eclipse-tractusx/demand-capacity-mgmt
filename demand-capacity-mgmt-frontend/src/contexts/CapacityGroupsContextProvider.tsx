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
import {CapacityGroup, SingleCapacityGroup} from '../interfaces/capacitygroup_interfaces';


interface CapacityGroupContextData {
  capacitygroups: CapacityGroup[];
  getCapacityGroupById: (id: string) =>Promise<SingleCapacityGroup | undefined>;
  isLoading: boolean;
}

export const CapacityGroupContext = createContext<CapacityGroupContextData | undefined>(undefined);


const CapacityGroupsProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  

  const [capacitygroups, setCapacityGroups] = useState<CapacityGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

useEffect(() => {
  const maxRetries = 3;

  const fetchCapacityGroupsWithRetry = async () => {
    setIsLoading(true);

    for (let retries = 0; retries < maxRetries; retries++) {
      try {
        const response = await axios.get('/capacityGroup', {});
        const result: CapacityGroup[] = response.data;
        setCapacityGroups(result);
        setIsLoading(false); // Set isLoading to false on success
        setRetryCount(0); // Reset the retry count on success
        return; // Exit the loop on success
      } catch (error) {
        console.error(`Error fetching capacitygroups (Retry ${retries + 1}):`, error);

        if (retries < maxRetries - 1) {
          // If not the last retry, delay for 30 seconds before the next retry
          await new Promise((resolve) => setTimeout(resolve, 30000));
          setRetryCount(retries + 1); // Increment the retry count
        } else {
          // If the last retry failed, set isLoading to false and do not retry further
          setIsLoading(false);
          setRetryCount(0); // Reset the retry count
        }
      }
    }
  };

  fetchCapacityGroupsWithRetry();
}, []);
  

  const getCapacityGroupById = async (id: string): Promise<SingleCapacityGroup | undefined> => {
    try {
      const response = await axios.get(`/capacityGroup/${id}`);
      const fetchedCapacityGroup: SingleCapacityGroup = response.data;
      return fetchedCapacityGroup;
    } catch (error) {
      console.error('Error fetching CapacityGroup by id:', error);
      return undefined;
    }
  };

  return (
      <CapacityGroupContext.Provider value={{capacitygroups, getCapacityGroupById, isLoading}}>
        {props.children}
      </CapacityGroupContext.Provider>
  );
};








    export default CapacityGroupsProvider;
