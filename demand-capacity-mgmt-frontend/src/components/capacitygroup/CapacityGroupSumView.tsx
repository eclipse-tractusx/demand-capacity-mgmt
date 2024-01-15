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

import React, {useContext, useEffect, useState} from 'react';
import { Table } from 'react-bootstrap';
import {YearlyReportContext} from "../../contexts/YearlyReportContextProvider";
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subWeeks, addWeeks, formatISO, startOfDay } from 'date-fns';
import { FaRegCalendarCheck } from 'react-icons/fa';
import '../../../src/index.css';

interface WeeklyViewProps {
  capacityGroupID: string | null | undefined;
  startDate: string; // Assuming ISO format (YYYY-MM-DD)
  endDate: string; // Assuming ISO format (YYYY-MM-DD)
}

const CapacityGroupSumView: React.FC<WeeklyViewProps> = ({ capacityGroupID, startDate, endDate }) => {

  const { yearReports, fetchYearReports } = useContext(YearlyReportContext);
  const {demandcategories} = useContext(DemandCategoryContext) || {};

  // Use different names for internal date state
  const [internalStartDate, setInternalStartDate] = useState<Date>(new Date(startDate));
  const [internalEndDate, setInternalEndDate] = useState<Date>(new Date(endDate));

  // Handlers for date change
  const handleInternalStartDateChange = (date: Date) => {
    setInternalStartDate(date);
  };

  const handleInternalEndDateChange = (date: Date) => {
    setInternalEndDate(date);
  };



  useEffect(() => {
    if (capacityGroupID) {
      const formattedStartDate = formatISO(internalStartDate, { representation: 'date' });
      const formattedEndDate = formatISO(internalEndDate, { representation: 'date' });
      fetchYearReports(capacityGroupID, formattedStartDate, formattedEndDate);
    }
  }, [capacityGroupID, internalStartDate, internalEndDate, fetchYearReports]);


  if (!yearReports) {
    return <div>Loading...</div>;
  }

  const renderTable = () => {
    // Create an array of unique years from the backend data
    const uniqueYears = [...new Set(yearReports.map(report => report.year))];

    return (
        <div className="container">
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-sm">
              <thead>
              <tr>
                <th></th> {/* Empty header for demand categories */}
                {uniqueYears.map(year => {
                  const yearData = yearReports.find(report => report.year === year);
                  if (!yearData) return null;

                  // Calculate the colspan based on the number of weeks in the year report
                  const weeksInYear = yearData.monthReport.reduce(
                      (total, month) => total + month.weekReport.length,
                      0
                  );

                  return (
                      <th key={`year-${year}`} colSpan={weeksInYear}>
                        {year}
                      </th>
                  );
                })}
              </tr>
              <tr>
                <th>Demand Category</th> {/* Header for demand categories */}
                {uniqueYears.map(year => (
                    yearReports
                        .filter(report => report.year === year)
                        .flatMap(report =>
                            report.monthReport.flatMap(month => (
                                <th key={`month-${year}-${month.month}`} colSpan={month.weekReport.length}>
                                  {month.month}
                                </th>
                            ))
                        )
                ))}
              </tr>
              <tr>
                <th style={{ backgroundColor: 'rgba(128, 128, 128, 0.2)' }}></th> {/* Empty header for demand categories */}
                {uniqueYears.map(year => (
                    yearReports
                        .filter(report => report.year === year)
                        .flatMap(report =>
                            report.monthReport.flatMap(month =>
                                month.weekReport.map(week => (
                                    <th style={{ backgroundColor: 'rgba(128, 128, 128, 0.2)' }} key={`week-${year}-${month.month}-${week.week}`}>
                                      {week.week}
                                    </th>
                                ))
                            )
                        )
                ))}
              </tr>
              </thead>
              <tbody>
              {demandcategories?.map(category => (
                  <tr key={category.id}>
                    <td>{category.demandCategoryName}</td>
                    {uniqueYears.map(year => (
                        yearReports
                            .filter(report => report.year === year)
                            .flatMap(report =>
                                report.monthReport.flatMap(month =>
                                    month.weekReport.map(week => {
                                      const demandCategoryWeek = week.catID === category.id ? week : null;
                                      const hasDelta = demandCategoryWeek !== null;
                                      const bgColor = hasDelta
                                          ? demandCategoryWeek.delta >= 0
                                              ? 'rgba(148, 203, 45, 0.8)'
                                              : 'rgba(220, 53, 69, 0.8)'
                                          : '';
                                      const content = hasDelta ? demandCategoryWeek.delta.toString() : '';

                                      return (
                                          <td
                                              key={`week-${year}-${month.month}-${week.week}-${category.id}`}
                                              style={{ minWidth: '75px', textAlign: 'center', backgroundColor: bgColor }}
                                          >
                                            {content}
                                          </td>
                                      );
                                    })
                                )
                            )
                    ))}
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
    );
  };


  return (
      <div className='container'>
        {yearReports[0].ruled && (
            <h4 className="text-center mt-3">
              Rules are being enforced by your administrator
            </h4>
        )}
        <div className="date-range-container">
          <div className="pop-out-section">
            <div className="text-muted p-1"> <FaRegCalendarCheck /> Data Range</div>
            <div className="col-12 p-1 d-flex form-group align-items-center">
              <DatePicker
                  className="form-control"
                  selected={internalStartDate}
                  onChange={handleInternalStartDateChange}
                  selectsStart
                  startDate={internalStartDate}
                  endDate={internalEndDate}
                  placeholderText="Select a Start Date"
                  showYearDropdown
                  showMonthDropdown
                  dateFormat="yyyy-MM-dd"
              />
              <span className="mx-3">-</span>
              <DatePicker
                  className="form-control"
                  selected={internalEndDate}
                  onChange={handleInternalEndDateChange}
                  selectsEnd
                  startDate={internalStartDate}
                  endDate={internalEndDate}
                  minDate={internalStartDate}
                  placeholderText="Select an End Date"
                  showYearDropdown
                  showMonthDropdown
                  dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
        </div>
          <Table striped bordered hover size="sm">
            <tbody>{renderTable()}</tbody>
          </Table>
      </div>
  );
};

export default CapacityGroupSumView;