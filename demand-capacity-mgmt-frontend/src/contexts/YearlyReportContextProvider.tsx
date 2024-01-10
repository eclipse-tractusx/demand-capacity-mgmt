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
import createAPIInstance from "../util/Api";
import { useUser } from "./UserContext";

export interface WeekReport {
  week: number;
  delta: number;
  maxCapacity: number;
  actCapacity: number;
  catID: string | null;
  catCode: string | null;
  catName: string | null;
}
export interface MonthReport {
  month: string;
  weekReport: WeekReport[];
}

export interface YearReport {
  year: number;
  totalWeeksCurrentYear: number;
  monthReport: MonthReport[];
  capacityGroupId: string;
  ruled: boolean;
  percentage: number
}

interface YearReportContextValue {
  yearReport: YearReport | undefined;
  fetchYearReport: (cgID: string) => Promise<YearReport | undefined>;
}
export const YearlyReportContext = createContext<YearReportContextValue>({
  yearReport: undefined,
  fetchYearReport: async (cgID: string) => undefined, // A function returning a promise resolved with undefined
});
const YearlyReportContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

  const { access_token } = useUser();
  const [yearReport, setYearReport] = useState<YearReport | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchYearReport = async (cgID: string): Promise<YearReport | undefined> => {
    if (isLoading || !access_token || yearReport) {
      // Prevent fetching if already loading, no access token, or year report already exists
      return;
    }

    setIsLoading(true); // Set loading before the operation begins

    try {
      const api = createAPIInstance(access_token);
      const response = await api.post<YearReport>('/year/report', { cgID });
      setYearReport(response.data);
      //console.log(response.data)
      return response.data;
    } catch (error) {
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: YearReportContextValue = {
    yearReport,
    fetchYearReport
  };

  return (
      <YearlyReportContext.Provider value={contextValue}>
        {props.children}
      </YearlyReportContext.Provider>
  );
};

export default YearlyReportContextProvider;