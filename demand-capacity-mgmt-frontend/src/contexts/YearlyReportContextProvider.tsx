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

import React, {createContext, useCallback, useState} from 'react';
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
    yearReports: YearReport[] | undefined;
    fetchYearReports: (cgID: string, startDate: string, endDate: string) => Promise<void>;
}


export const YearlyReportContext = createContext<YearReportContextValue>({
    yearReports: undefined,
    fetchYearReports: async () => {},
});
const YearlyReportContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const { access_token } = useUser();
    const [yearReports, setYearReports] = useState<YearReport[] | undefined>(undefined);

    const fetchYearReports = useCallback(async (cgID: string, startDate: string, endDate: string) => {
        try {
            const api = createAPIInstance(access_token);
            const response = await api.post('/year/report', { cgID, startDate, endDate });
            setYearReports(response.data.reports);  // Assuming response.data has the 'reports' key
        } catch (error) {
            console.error(error);
            return undefined;
        } finally {
        }
    }, [access_token]);




    const contextValue: YearReportContextValue = {
        yearReports,
        fetchYearReports,
    };

    return (
        <YearlyReportContext.Provider value={contextValue}>
            {props.children}
        </YearlyReportContext.Provider>
    );
  };

export default YearlyReportContextProvider;