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
  const renderYearHeaders = () => {
    return yearReports.map(report => (
        <th key={report.year} colSpan={report.monthReport.flatMap(month => month.weekReport).length}>
          {report.year}
        </th>
    ));
  };
  const renderMonthHeaders = () => {
    return yearReports.flatMap(report =>
        report.monthReport.map(month => (
            <th key={`${report.year}-${month.month}`} colSpan={month.weekReport.length}>
              {month.month}
            </th>
        ))
    );
  };

  const renderWeekNumbers = () => {
    return yearReports.map(report =>
        report.monthReport.flatMap((month: { weekReport: any[]; month: any; }) =>
            month.weekReport.map(week => (
                <th key={`${report.year}-${month.month}-${week.week}`}>{week.week}</th>
            ))
        )
    ).flat();
  };



  const renderTableBody = () => {
    return demandcategories?.map(category => (
        <tr key={category.id}>
          <td>{category.demandCategoryName}</td>
          {yearReports.flatMap(report =>
              report.monthReport.flatMap(month =>
                  month.weekReport.map(week => {
                    const key = `${report.year}-${month.month}-${week.week}-${category.id}`;
                    const bgColor = week.catID === category.id ? (week.delta >= 0 ? 'rgba(148, 203, 45, 0.8)' : 'rgba(220, 53, 69, 0.8)') : '';
                    const content = week.catID === category.id ? week.delta.toString() : '';
                    return (
                        <td key={key}
                            style={{minWidth: '75px', textAlign: 'center', backgroundColor: bgColor}}>
                          {content}
                        </td>
                    );
                  })
              )
          )}
        </tr>
    ));
  };

  return (
      <div className='container'>
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
        <div style={{overflowX: 'auto'}}>
          <Table striped bordered hover size="sm">
            <thead>
            <tr>{renderYearHeaders()}</tr>
            <tr>
              <th>Demand Category</th>
              {renderMonthHeaders()}
            </tr>
            <tr>{renderWeekNumbers()}</tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </div>
      </div>
  );
};

export default CapacityGroupSumView;