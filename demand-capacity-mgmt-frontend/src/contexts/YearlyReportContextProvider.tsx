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

interface WeekReport {
  week: number;
  data: string; // Replace 'string' with the actual data type you plan to use
}

interface MonthReport {
  month: string;
  weeks: WeekReport[];
}

interface YearReport {
  year: number;
  totalWeeksCurrentYear: number;
  months: MonthReport[];
}

// Define a context value type
interface YearReportContextValue {
  yearReport: YearReport | undefined;
}

export const YearlyReportContext = createContext<YearReportContextValue>({
  yearReport: undefined,
  // Initialize any additional state or functions here
});

const YearlyReportContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const { access_token } = useUser();
  const [yearReport, setYearReport] = useState<YearReport | undefined>(undefined);

  useEffect(() => {
    const api = createAPIInstance(access_token);
    const fetchYearReport = async () => {
      try {
        const response = await api.get<YearReport>('/yearreport');
        setYearReport(response.data);
      } catch (error) {
        console.error('Error fetching year report:', error);
      }
    };

    if (access_token) {
      fetchYearReport();
    }
  }, [access_token]);

  const contextValue = {
    yearReport,
    // Add any additional state or functions here
  };

  return (
      <YearlyReportContext.Provider value={contextValue}>
        {props.children}
      </YearlyReportContext.Provider>
  );
};

export default YearlyReportContextProvider;
