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
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../../../src/index.css';
import { addDays, addMonths, addWeeks, format, getISOWeek, startOfMonth } from 'date-fns';
import { FaArrowDown, FaArrowRight } from 'react-icons/fa';
import YearlyReportContextProvider, { YearlyReportContext } from "../../contexts/YearlyReportContextProvider";
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';
import {loadingMessageCSS} from "react-select/src/components/Menu";

interface WeeklyViewProps {
  capacityGroupID: string | null | undefined;
}
const CapacityGroupSumView: React.FC<WeeklyViewProps> = ({ capacityGroupID}) => {

  const { demandcategories } = useContext(DemandCategoryContext) || {};
  const { yearReport } = useContext(YearlyReportContext) || {};

  if(!yearReport){
    loadingMessageCSS()
  }

  // DEMAND CATEGORIES
  //Mapping of demand categories
  const idToNumericIdMap: Record<string, number> = {};
  if (demandcategories) {
    demandcategories.forEach((category, index) => {
      idToNumericIdMap[category.id] = index;
    });
  }
  // Track which Demand.description rows are expanded
  const [expandedDemandRows, setExpandedDemandRows] = useState<Record<string, boolean>>({});
  // Function to toggle the expansion of a Demand.description row
  const toggleDemandRowExpansion = (demandId: string) => {
    setExpandedDemandRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [demandId]: !prevExpandedRows[demandId],
    }));
  };


  return (
    <div className='container'>
      <div className="table-container">
        <div className="container">
          <table className="vertical-table">
            <thead>
              <tr>
                <th className="empty-header-cell"></th>
                <th colSpan={yearReport.totalWeeksCurrentYear} className="header-cell">
                  {yearReport.year}
                </th>
              </tr>
              <tr>
                {monthsCurrentYear.map((month) => (
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                ))}
              </tr>
              <tr>
                {monthsCurrentYear.map((month) =>
                  month.weeks.map((week) => (
                    <th key={month.name + week} className="header-cell week-header-cell">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`week-tooltip-${month.year}-${week}`}>
                            {`Week ${week} - ${getWeekDates(month.year, month.name, week).startDate} to ${getWeekDates(
                              month.year,
                              month.name,
                              week
                            ).endDate}`}
                          </Tooltip>
                        }
                      >
                        <span>{week}</span>
                      </OverlayTrigger>
                    </th>
                  ))
                )}
              </tr>

              <tr>
                <th className="sticky-header-cell">
                  <div className="sticky-header-content" onClick={() => toggleDemandRowExpansion('total')}>
                    {expandedDemandRows['total'] ? <FaArrowDown /> : <FaArrowRight />} Demands (Sum)
                  </div>
                </th>
                {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                  month.weeks.map((week) => (
                    <td
                      key={`demand-${week}`}
                      className={`data-cell ${demandSums[week] !== 0 ? 'non-zero-demand-cell' : ''}`}
                      // Assign an ID to each cell to identify it for focusing
                      id={`cell-${week}`}
                      // Use the created ref directly without the need for a ternary operator
                      ref={demandSums[week] !== 0 ? firstNonZeroDemandRef : undefined}
                    >
                      {demandSums[week] !== 0 ? demandSums[week] : '-'} {/*Todo Stylize */}
                    </td>
                  ))
                )}
              </tr>
              {expandedDemandRows['total'] && (
                <>
                  {capacityGroup &&
                    materialDemands &&
                    materialDemands.map((demand) => (
                      <React.Fragment key={`demand-row-${demand.id}`}>
                        <tr>
                          <th className="sticky-header-cell">
                            <div
                              className="sticky-header-content table-header-nested-text "
                              onClick={() => toggleDemandRowExpansion(demand.id)}
                            >
                              {expandedDemandRows[demand.id] ? <FaArrowDown /> : <FaArrowRight />} {demand.materialDescriptionCustomer}
                            </div>
                          </th>
                          {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                            month.weeks.map((week) => {
                              const demandSum =
                                demandSumsByDemandAndWeek[demand.materialDescriptionCustomer]?.[week] || null;
                              return (
                                <td key={`demandSeries-${week}-${demand.id}`} className="data-cell">
                                  <strong>{demandSum !== null ? (demandSum || 0) : '-'}</strong>
                                </td>
                              );
                            })
                          )}
                        </tr>
                        {expandedDemandRows[demand.id] && (
                          <>
                            {demand.demandSeries?.map((demandSeries) => (
                              <React.Fragment key={`demandSeries-row-${demandSeries.demandCategory.id}`}>
                                <tr>
                                  <th className="sticky-header-cell">
                                    <div className="sticky-header-content table-header-nested-text-child">
                                      {demandSeries.demandCategory.demandCategoryName}
                                    </div>
                                  </th>
                                  {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                                    month.weeks.map((week) => {
                                      const demandValue = demandSeries.demandSeriesValues.find(
                                        (demandValue) => getISOWeek(new Date(demandValue.calendarWeek)) === week
                                      );
                                      const demandSum = demandValue?.demand || null;
                                      return (
                                        <td key={`demandSeries-${week}-${demandSeries.demandCategory.id}`} className="data-cell">
                                          {demandSum !== null ? (demandSum || 0) : '-'}
                                        </td>
                                      );
                                    })
                                  )}
                                </tr>
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </React.Fragment>
                    ))}
                </>
              )}
              <tr>
                <th className="sticky-header-cell">
                  <div className="sticky-header-content">-</div>
                </th>
                {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                  month.weeks.map((week) => (
                    <td key={`empty-${week}`} className="data-cell">
                      {' '}
                    </td>
                  ))
                )}
              </tr>
              <tr>
                <th className="sticky-header-cell">
                  <div className="sticky-header-content">Actual Capacity</div>
                </th>
                {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                  month.weeks.map((week) => {
                    const matchingCapacity = capacityGroup?.capacities.find((capacity) => {
                      const capacityWeek = new Date(capacity.calendarWeek);
                      return getISOWeek(capacityWeek) === week;
                    });
                    const actualCapacity = matchingCapacity?.actualCapacity ?? '-';

                    return (
                      <td key={`actual-capacity-${week}`} className="data-cell">
                        {actualCapacity.toString()}
                      </td>
                    );
                  })
                )}
              </tr>
              <tr>
                <th className="sticky-header-cell">
                  <div className="sticky-header-content">Maximum Capacity</div>
                </th>
                {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                  month.weeks.map((week) => {
                    const matchingCapacity = capacityGroup?.capacities.find((capacity) => {
                      const capacityWeek = new Date(capacity.calendarWeek);
                      return getISOWeek(capacityWeek) === week;
                    });
                    const maximumCapacity = matchingCapacity?.maximumCapacity ?? '-';

                    return (
                      <td key={`actual-capacity-${week}`} className="data-cell">
                        {maximumCapacity.toString()}
                      </td>
                    );
                  })
                )}
              </tr>
              <tr>
                <th className="sticky-header-cell">
                  <div className="sticky-header-content">-</div>
                </th>
                {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                  month.weeks.map((week) => (
                    <td key={`empty-${week}`} className="data-cell">
                      {' '}
                    </td>
                  ))
                )}
              </tr>
              <tr>
                <th className="sticky-header-cell">
                  <div className="sticky-header-content">Delta</div>
                </th>
                {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                  month.weeks.map((week) => (
                    <td
                      key={`delta-${month.year}-${week}`}
                      className={`data-cell ${deltaMap[month.year]?.[week] < 0 ? 'bg-light-red' : deltaMap[month.year]?.[week] > 0 ? 'bg-light-green' : ''}`}
                    >
                      {deltaMap[month.year][week] > 0 ? `+${deltaMap[month.year][week]}` : deltaMap[month.year][week]}
                    </td>
                  ))
                )}
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
}


export default CapacityGroupSumView;