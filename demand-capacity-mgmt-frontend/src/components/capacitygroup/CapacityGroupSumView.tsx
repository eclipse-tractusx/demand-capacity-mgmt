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

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {OverlayTrigger, Table, Tooltip} from 'react-bootstrap';
import '../../../src/index.css';
import { addDays, addMonths, addWeeks, format, getISOWeek, startOfMonth } from 'date-fns';
import { FaArrowDown, FaArrowRight } from 'react-icons/fa';
import { YearlyReportContext } from "../../contexts/YearlyReportContextProvider";
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';

interface WeeklyViewProps {
  capacityGroupID: string | null | undefined;
}

const CapacityGroupSumView: React.FC<WeeklyViewProps> = ({ capacityGroupID}) => {

  const { demandcategories } = useContext(DemandCategoryContext) || {};
  const { yearReport } = useContext(YearlyReportContext) || {};

  useEffect(() => {

  }, []);

  // Track which Demand.description rows are expanded
  const [expandedDemandRows, setExpandedDemandRows] = useState<Record<string, boolean>>({});
  if (!yearReport) {
    return <div>Loading...</div>; // Adjusted loading logic
  }

  const renderTooltip = (weekNumber: number) => (
      <Tooltip id={`week-tooltip-${weekNumber}`}>
        Week {weekNumber}
      </Tooltip>
  );

  // DEMAND CATEGORIES
  //Mapping of demand categories
  const idToNumericIdMap: Record<string, number> = {};
  if (demandcategories) {
    demandcategories.forEach((category, index) => {
      idToNumericIdMap[category.id] = index;
    });
  }

  // Function to toggle the expansion of a Demand.description row
  const toggleDemandRowExpansion = (demandId: string) => {
    setExpandedDemandRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [demandId]: !prevExpandedRows[demandId],
    }));
  };


  return (
      <div className='container'>
        <Table striped bordered hover size="sm">
          <thead>
          <tr>
            <th>#</th>
            {yearReport.monthReport.map((month) => (
                <th key={month.month} colSpan={month.weekReport.length}>
                  {month.month}
                </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {yearReport.monthReport.flatMap((month, monthIndex) =>
              month.weekReport.map((week, weekIndex) => (
                  <tr key={`${monthIndex}-${weekIndex}`}>
                    <td>
                      <OverlayTrigger placement="top" overlay={renderTooltip(week.week)}>
                        <span>{week.week}</span>
                      </OverlayTrigger>
                    </td>
                    <td>{week.delta}</td>
                    <td>{week.maxCapacity}</td>
                    <td>{week.actCapacity}</td>
                    {/* Additional data columns */}
                  </tr>
              ))
          )}
          {/* Rows for demand categories */}
          {demandcategories?.map((category, categoryIndex) => (
              <tr key={categoryIndex}>
                <td colSpan={4 + 8}>
                  {category.demandCategoryName}
                  {/* Render more details about demand categories if needed */}
                </td>
              </tr>
          ))}
          </tbody>
        </Table>
      </div>
  );
}

export default CapacityGroupSumView;