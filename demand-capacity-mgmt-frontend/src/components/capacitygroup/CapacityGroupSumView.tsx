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

import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { YearlyReportContext } from "../../contexts/YearlyReportContextProvider";
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';

interface WeeklyViewProps {
  capacityGroupID: string | null | undefined;
}

interface TableData {
  [key: string]: {
    bgColor: string;
    content: string;
  };
}

const CapacityGroupSumView: React.FC<WeeklyViewProps> = ({ capacityGroupID }) => {

  const { demandcategories } = useContext(DemandCategoryContext) || {};
  const { yearReport, fetchYearReport } = useContext(YearlyReportContext);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [tableData, setTableData] = useState<TableData>({});

  useEffect(() => {
    if (capacityGroupID && !yearReport && !isLoading) {
      setIsLoading(true);
      fetchYearReport(capacityGroupID)
          .then(() => setDataFetched(true)) // Set state to trigger re-render
          .catch(error => console.error('Failed to fetch year report:', error))
          .finally(() => setIsLoading(false));
    }
  }, [capacityGroupID, yearReport, isLoading, fetchYearReport]);

  useEffect(() => {
    if (yearReport) {
      const newTableData: TableData = {};
      yearReport.monthReport.forEach(month => {
        month.weekReport.forEach(week => {
          // Use the week and category ID to generate a unique key for each cell
          demandcategories?.forEach(category => {
            const key = `${month.month}-${week.week}-${category.id}`;
            if (week.catID === category.id) {
              if (week.delta < 0) {
                newTableData[key] = { bgColor: 'rgba(220, 53, 69, 0.5)', content: week.delta.toString() };
              } else if (week.delta === 0) {
                newTableData[key] = { bgColor: 'rgba(148, 203, 45, 0.5)', content: '0' };
              }
            }
          });
          // For weeks without specific category data, use a generic key
          const genericKey = `${month.month}-${week.week}`;
          if (!week.catID) {
            newTableData[genericKey] = { bgColor: '', content: '' };
          }
        });
      });
      console.log('Table data constructed:', newTableData);
      setTableData(newTableData); // Update the state
    }
  }, [yearReport, demandcategories]); // Add demandcategories as a dependency



  if (!yearReport && !dataFetched) {
    return <div>LOADING</div>;
  }

  return (
      <div className='container'>
        <div style={{ overflowX: 'auto' }}>
          <Table striped bordered hover size="sm">
            <thead>
            <tr>
              <th colSpan={5}>{yearReport?.year}</th>
              <th colSpan={48}>Rules are being applied by your administrator</th>
            </tr>
            <tr>
              <th>Demand Category</th>
              {yearReport?.monthReport.map((month) => (
                  <th key={month.month} colSpan={month.weekReport.length}>{month.month}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {demandcategories?.map(category => (
                <tr key={category.id}>
                  <td>{category.demandCategoryName}</td>
                  {yearReport?.monthReport.flatMap(month =>
                      month.weekReport.map(week => {
                        // Construct the key with the category ID
                        const key = `${month.month}-${week.week}-${category.id}`;
                        const genericKey = `${month.month}-${week.week}`;
                        // Use the specific key if available, otherwise fall back to the generic key
                        const cellData = tableData[key] || tableData[genericKey];
                        return (
                            <td key={key}
                                style={{
                                  minWidth: '75px',
                                  textAlign: 'center',
                                  backgroundColor: cellData?.bgColor || '',
                                }}>
                              {cellData?.content || ''}
                            </td>
                        );
                      })
                  )}
                </tr>
            ))}
            </tbody>
          </Table>
        </div>
      </div>
  );
}
export default CapacityGroupSumView;