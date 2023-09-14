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

import React, { useContext, useState, useEffect } from 'react';
import '../../../src/index.css';
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';
import { Demand, DemandCategory, DemandProp, DemandSeriesValue, MaterialDemandSery } from '../../interfaces/demand_interfaces';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DemandContext } from '../../contexts/DemandContextProvider';

import { getISOWeek, startOfMonth, addDays, format, addWeeks, addMonths } from 'date-fns';
import { SingleCapacityGroup } from '../../interfaces/capacitygroup_interfaces';

interface WeeklyViewProps {
  capacityGroup: SingleCapacityGroup | null | undefined;
}

function getISOWeekMonday(year: number, isoWeek: number): Date {
  const january4 = new Date(year, 0, 4);
  const diff = (isoWeek - 1) * 7 + (1 - january4.getDay());
  return addDays(january4, diff);
}

function getWeeksInMonth(year: number, monthIndex: number): number[] {
  const firstDayOfMonth = startOfMonth(new Date(year, monthIndex));
  const nextMonth = startOfMonth(addMonths(firstDayOfMonth, 1));

  let weeks = [];
  let currentDay = firstDayOfMonth;

  while (currentDay < nextMonth) {
    weeks.push(getISOWeek(currentDay));
    currentDay = addWeeks(currentDay, 1);
  }

  return weeks;
}




const CapacityGroupSumView: React.FC<WeeklyViewProps> = ({ capacityGroup }) => {
  const { demandcategories } = useContext(DemandCategoryContext) || {};
  const currentYear = new Date().getFullYear();

  const [editMode, setEditMode] = useState(false);
  const [savedChanges, setSavedChanges] = useState(false);

  const monthsCurrentYear = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = new Date(currentYear, monthIndex, 1);
    const monthName = format(monthStart, 'MMM');
    const weeks = getWeeksInMonth(currentYear, monthIndex);

    return {
      name: monthName,
      year: currentYear,
      weeks: weeks,
      monthIndex: monthIndex,
    };
  });

  const monthsPreviousYear = Array.from({ length: 1 }, (_, monthIndex) => {
    const monthStart = new Date(currentYear - 1, monthIndex + 11, 1);
    const monthName = format(monthStart, 'MMM');
    const weeks = getWeeksInMonth(currentYear - 1, monthIndex + 11);

    return {
      name: monthName,
      year: currentYear - 1,
      weeks: weeks,
      monthIndex: monthIndex + 11,
    };
  });

  const monthsNextYear = Array.from({ length: 1 }, (_, monthIndex) => {
    const monthStart = new Date(currentYear + 1, monthIndex, 1);
    const monthName = format(monthStart, 'MMM');
    const weeks = getWeeksInMonth(currentYear + 1, monthIndex);

    return {
      name: monthName,
      year: currentYear + 1,
      weeks: weeks,
      monthIndex: monthIndex,
    };
  });

  const totalWeeksPreviousYear = monthsPreviousYear.reduce((total, month) => total + month.weeks.length, 0);
  const totalWeeksCurrentYear = monthsCurrentYear.reduce((total, month) => total + month.weeks.length, 0);
  const totalWeeksNextYear = monthsNextYear.reduce((total, month) => total + month.weeks.length, 0);

  // Object to store the demand values based on year, month, and week
  type DemandValuesMap = Record<string, Record<number, Record<string, number>>>;
  let [demandValuesMap, setDemandValuesMap] = useState<DemandValuesMap>({});

  //Mapping of categories
  const idToNumericIdMap: Record<string, number> = {};

  if (demandcategories) {
    demandcategories.forEach((category, index) => {
      idToNumericIdMap[category.id] = index;
    });
  }

  console.log(demandValuesMap);
  // Function to get the beginning and end dates of the week
  const getWeekDates = (year: number, month: string, week: number) => {
    const startDate = getISOWeekMonday(year, week);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // Assuming weeks end on Saturdays

    return {
      startDate: startDate.toDateString(),
      endDate: endDate.toDateString(),
    };
  };

  return (
    <div className='container'>
      <div className="table-container">
        <div className="container">
          <table className="vertical-table">
            <thead>
              <tr>
                <th className="empty-header-cell"></th>
                <th colSpan={totalWeeksPreviousYear} className="header-cell">
                  {currentYear - 1}
                </th>
                <th colSpan={totalWeeksCurrentYear} className="header-cell">
                  {currentYear}
                </th>
                <th colSpan={totalWeeksNextYear} className="header-cell">
                  {currentYear + 1}
                </th>
              </tr>
              <tr>
                <th className="empty-header-cell"></th>
                {monthsPreviousYear.map((month) => (
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                ))}
                {monthsCurrentYear.map((month) => (
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                ))}
                {monthsNextYear.map((month) => (
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="empty-header-cell"></th>
                {monthsPreviousYear.map((month) =>
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
                {monthsNextYear.map((month) =>
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
                  <div className="sticky-header-content">Delta</div>
                </th>
                {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                  month.weeks.map((week) => (
                    <td key={`delta-${week}`} className="data-cell">

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
};


export default CapacityGroupSumView;