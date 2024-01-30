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
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Demand, DemandProp } from '../interfaces/demand_interfaces';
import createAPIInstance from "../util/Api";
import { customErrorToast } from '../util/ErrorMessagesHandler';
import { is404Error, isAxiosError, isTimeoutError } from '../util/TypeGuards';
import { useUser } from "./UserContext";


interface DemandContextData {
  demandprops: DemandProp[];
  createDemand: (newDemand: Demand) => Promise<void>;
  getDemandbyId: (id: string) => Promise<DemandProp | undefined>;
  deleteDemand: (id: string) => Promise<void>;
  unlinkDemand: (id: string, capacitygroupId: string) => Promise<void>;
  updateDemand: (updatedDemand: Demand) => Promise<void>;
  fetchDemandProps: () => void;
  isLoading: boolean;
}

export const DemandContext = createContext<DemandContextData | undefined>(undefined);

const DemandContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [demandprops, setDemandProps] = useState<DemandProp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { access_token } = useUser();
  const api = createAPIInstance(access_token);

  const objectType = '1';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDemandPropsWithRetry = useMemo(() => async (maxRetries = 3) => {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        setIsLoading(true);
        const response = await api.get('/demand', {
        });
        const result: DemandProp[] = response.data;
        setDemandProps(result);
        setIsLoading(false); // Set isLoading to false on success
        return; // Exit the loop on success
      } catch (error) {
        retries++;
        if (retries < maxRetries) {
          // Delay for 30 seconds before the next retry
          await new Promise((resolve) => setTimeout(resolve, 30000));
        } else {
          customErrorToast(objectType, '0', '00')
          setIsLoading(false); // Set isLoading to false on max retries
        }
      }
    }
  }, [api]);

  const fetchDemandProps = useCallback(() => {
    fetchDemandPropsWithRetry();
  }, [access_token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchDemandProps();
  }, [fetchDemandProps, access_token]);

  const getDemandbyId = async (id: string): Promise<DemandProp | undefined> => {
    try {
      const response = await api.get(`/demand/${id}`);
      return response.data;
    } catch (error) {
      if (isTimeoutError(error)) {
        // This is a timeout error
        customErrorToast(objectType, '0', '00')
      } else if (is404Error(error) && error.response && error.response.status === 404) {
        // This is a 404 Internal Server Error
        customErrorToast(objectType, '4', '04')
      } else if (isAxiosError(error) && error.response && error.response.status === 500) {
        // This is a 500 Internal Server Error
        customErrorToast(objectType, '5', '00')
      } else {
        // Handle other types of errors
        customErrorToast('5', '0', '0') //This will trigger, Unkown error
      }
    }
  };


  const deleteDemand = async (id: string) => {
    try {
      await api.delete(`/demand/${id}`);
      fetchDemandProps();
    } catch (error) {
      customErrorToast(objectType, '0', '90')
    }
  };

  const createDemand = async (newDemand: Demand) => {
    try {
      await api.post('/demand', newDemand);
    } catch (error) {
      customErrorToast(objectType, '1', '00')
    }
  };

  const updateDemand = async (updatedDemand: Demand) => {
    try {
      await api.put(`/demand/${updatedDemand.id}`, updatedDemand);
      fetchDemandProps();
    } catch (error) {
      customErrorToast(objectType, '1', '15')
    }
  };

  const unlinkDemand = async (materialDemandID: string, capacityGroupID: string) => {
    const api = createAPIInstance(access_token);

    try {
      const unlinkreq = {
        materialDemandID: materialDemandID,
        capacityGroupID: capacityGroupID,
      };
      await api.post('/demand/series/unlink', unlinkreq);
    } catch (error) {
      customErrorToast(objectType, '1', '16')
      throw error;
    }
  };

  return (
    <DemandContext.Provider value={{ demandprops, deleteDemand, unlinkDemand, createDemand, updateDemand, getDemandbyId, fetchDemandProps, isLoading }}>
      {props.children}
    </DemandContext.Provider>
  );
};

export default DemandContextProvider;
