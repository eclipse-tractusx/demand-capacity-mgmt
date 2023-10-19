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
import {
  CapacityGroupCreate,
  CapacityGroupLink,
  CapacityGroupProp,
  SingleCapacityGroup
} from '../interfaces/capacitygroup_interfaces';
import createAPIInstance from "../util/Api";
import { useUser } from './UserContext';


interface CapacityGroupContextData {
  capacitygroups: CapacityGroupProp[];
  fetchCapacityGroupsWithRetry: () => Promise<void>;
  getCapacityGroupById: (id: string) => Promise<SingleCapacityGroup | undefined>;
  isLoading: boolean;
  createCapacityGroup: (newCapacityGroup: CapacityGroupCreate) => Promise<SingleCapacityGroup | undefined>;
  linkToCapacityGroup: (linkToCapacityGroup: CapacityGroupLink) => Promise<void>;
}

export const CapacityGroupContext = createContext<CapacityGroupContextData | undefined>(undefined);


const CapacityGroupsProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const { access_token } = useUser();
  const [capacitygroups, setCapacityGroups] = useState<CapacityGroupProp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const api = createAPIInstance(access_token);


  const fetchCapacityGroupsWithRetry = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await api.get('/capacityGroup', {});
      const result: CapacityGroupProp[] = response.data;
      setCapacityGroups(result);
    } catch (error) {
      console.error(`Error fetching capacitygroups (Retry ${retryCount + 1}):`, error);

      if (retryCount < maxRetries - 1) {
        // If not the last retry, delay for 30 seconds before the next retry
        await new Promise((resolve) => setTimeout(resolve, 30000));
        setRetryCount(retryCount + 1); // Increment the retry count
      } else {
        // If the last retry failed, do not retry further
        setRetryCount(0); // Reset the retry count
      }
    } finally {
      // Set isLoading to false regardless of success or failure
      setIsLoading(false);
    }
  }, [retryCount, setCapacityGroups, setIsLoading, setRetryCount, api]);

  useEffect(() => {
    if (retryCount < maxRetries) {
      fetchCapacityGroupsWithRetry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount, maxRetries]);


  const getCapacityGroupById = async (id: string): Promise<SingleCapacityGroup | undefined> => {
    const api = createAPIInstance(access_token);
    try {
      const response = await api.get(`/capacityGroup/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching CapacityGroup by id:', error);
      return undefined;
    }
  };

  const createCapacityGroup = async (newCapacityGroup: CapacityGroupCreate): Promise<SingleCapacityGroup | undefined> => {
    try {
      const api = createAPIInstance(access_token);
      const response = await api.post('/capacityGroup', newCapacityGroup);
      return response.data;
    } catch (error) {
      console.error('Error creating capacityGroup:', error);
    }
  };

  const linkToCapacityGroup = async (linkToCapacityGroup: CapacityGroupLink) => {
    try {
      const api = createAPIInstance(access_token);
      await api.post('/capacityGroup/link', linkToCapacityGroup);
    } catch (error) {
      console.error('Error creating capacityGroup:', error);
    }
  };

  return (
    <CapacityGroupContext.Provider value={{ capacitygroups, fetchCapacityGroupsWithRetry, getCapacityGroupById, isLoading, createCapacityGroup, linkToCapacityGroup }}>
      {props.children}
    </CapacityGroupContext.Provider>
  );
};

export default CapacityGroupsProvider;
