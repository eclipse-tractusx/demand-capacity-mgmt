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
import '../../index.css';
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';
import { Demand, DemandCategory, DemandProp, DemandSeriesValue, MaterialDemandSery } from '../../interfaces/demand_interfaces';
import { Button, ButtonGroup, ToggleButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DemandContext } from '../../contexts/DemandContextProvider';
import moment from 'moment';
import 'moment-weekday-calc';


import {getISOWeek, format,} from 'date-fns';

interface WeeklyViewProps {
  demandData: DemandProp;
}

function getISOWeekMonday(year: number, isoWeek: number): moment.Moment {
  return moment().year(year).isoWeek(isoWeek).startOf('isoWeek');
}

function getYearOfWeek(date: moment.Moment): number {
  return date.add(3, 'days').year();
}


function getWeeksInMonth(year: number, monthIndex: number, knownNextMonthWeeks?: Set<number>): number[] {
  const weeks: Set<number> = new Set();

  const firstDayOfMonth = moment().year(year).month(monthIndex).startOf('month');
  const lastDayOfMonth = moment().year(year).month(monthIndex).endOf('month');
  // Fetch weeks of the next month if not provided.
  if (!knownNextMonthWeeks && monthIndex < 11) {
    knownNextMonthWeeks = new Set(getWeeksInMonth(year, monthIndex + 1));
  }

  let currentDay = firstDayOfMonth;
  while (currentDay <= lastDayOfMonth) {
    const weekNum = currentDay.week();
    const isoWeekYear = getYearOfWeek(currentDay);

    // If the month is January and the week year is the previous year, skip it
    if (monthIndex === 0 && isoWeekYear < year) {
      currentDay = currentDay.add(1, 'days');
      continue;
    }

    // If it's the last week of the month and it's also in the next month, skip it.
    if (currentDay.isAfter(moment(new Date(year, monthIndex, 24))) && knownNextMonthWeeks?.has(weekNum)) {
      currentDay = currentDay.add(1, 'days');
      continue;
    }

    weeks.add(weekNum);
    currentDay = currentDay.add(1, 'days');
  }
  return Array.from(weeks).sort((a, b) => a - b);
}



const WeeklyView: React.FC<WeeklyViewProps> = ({ demandData }) => {
  const { updateDemand } = useContext(DemandContext)!;
  const { demandcategories } = useContext(DemandCategoryContext) ?? {};
  const currentYear = new Date().getFullYear();

  const [editMode, setEditMode] = useState(false);

  const monthsPreviousYear = Array.from({ length: 1 }, (_, monthIndex) => {
    const monthStart = new Date(currentYear - 1, monthIndex + 11, 1);
    const monthName = format(monthStart, 'MMM'); // <-- This line
    let weeks = getWeeksInMonth(currentYear - 1, monthIndex + 11);
    return {
      name: monthName,
      year: currentYear - 1,
      weeks: weeks,
      monthIndex: monthIndex + 11,
    };
  });

  const monthsCurrentYear = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = new Date(currentYear, monthIndex, 1);
    const monthName = format(monthStart, 'MMM');
    let weeks = getWeeksInMonth(currentYear, monthIndex);
    return {
      name: monthName,
      year: currentYear,
      weeks: weeks,
      monthIndex: monthIndex,
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

  // Function to get the beginning and end dates of the week
  const getWeekDates = (year: number, month: string, week: number) => {
    const startDate = getISOWeekMonday(year, week);

    const endDate = startDate.clone().add(6, 'days'); // Instead of using native Date() methods

    return {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    };
  };




  useEffect(() => {
    console.log("aqui")
    const newDemandValuesMap: DemandValuesMap = {};

    demandData.demandSeries?.forEach((series) => {
      const categoryId = series.demandCategory.id;

      series.demandSeriesValues.forEach((value) => {
        const date = moment(value.calendarWeek);
        const year = moment().year();
        const week = date.week();
        console.log(week);

        if (!newDemandValuesMap[categoryId]) {
          newDemandValuesMap[categoryId] = {};
        }
        if (!newDemandValuesMap[categoryId][year]) {
          newDemandValuesMap[categoryId][year] = {};
        }
        newDemandValuesMap[categoryId][year][week] = value.demand;
      });
    });

    setDemandValuesMap(newDemandValuesMap);
  }, [demandData]);

  const handleSave = async () => {
    if (!demandData.demandSeries) {
      return;
    }

    // Create new MaterialDemandSery objects for categories with data
    const updatedDemandSeries: (MaterialDemandSery | null)[] = demandcategories!.map((category) => {
      const categoryId = category.id;
      const demandSeriesValues: DemandSeriesValue[] = [];

      // Check if there is data for this category in demandValuesMap
      if (demandValuesMap[categoryId]) {
        // Loop through months and weeks to populate demandSeriesValues
        monthsCurrentYear.forEach((month) => {
          month.weeks.forEach((week) => {
            const isoWeekMonday = getISOWeekMonday(month.year, week);
            isoWeekMonday.format('YYYY-MM-dd')
            // Get the Monday of the ISO week
            const demand = demandValuesMap[categoryId]?.[month.year]?.[week];
            if (demand !== undefined) {
              demandSeriesValues.push({
                calendarWeek: isoWeekMonday.format('YYYY-MM-DD'),
                demand: demand,
              });
            }
          });
        });

        // Only return an updated demandSeries if demandSeriesValues are not empty
        if (demandSeriesValues.length > 0) {
          return {
            customerLocationId: demandData.customer.id,
            expectedSupplierLocationId: [demandData.supplier.id],
            demandCategoryId: categoryId,
            demandSeriesValues: demandSeriesValues,
          } as MaterialDemandSery;
        }
      }

      return null; // Skip this category if it has no data
    });

    // Filter out null values and assert the type
    const filteredUpdatedDemandSeries: MaterialDemandSery[] = updatedDemandSeries.filter(
        (series): series is MaterialDemandSery => series !== null
    );

    const updatedDemand: Demand = {
      id: demandData.id,
      customerId: demandData.customer.id,
      supplierId: demandData.supplier.id,
      materialDemandSeries: filteredUpdatedDemandSeries,
      materialDescriptionCustomer: demandData.materialDescriptionCustomer,
      materialNumberCustomer: demandData.materialNumberCustomer,
      materialNumberSupplier: demandData.materialNumberSupplier,
      unitMeasureId: demandData.unitMeasureId.id,
    };

    // Perform save operation with updatedDemandData

    if (filteredUpdatedDemandSeries.length > 0) {
      try {
        await updateDemand(updatedDemand);
      } catch (error) {
        console.error('Error updating demand:', error);
      }
    }

    setEditMode(false);
  };


  const handleRevert = () => {
    // Reload data from demandData
    // This can be done by updating the demandValuesMap with the original data from demandData
    const newDemandValuesMap: DemandValuesMap = {};

    demandData.demandSeries?.forEach((series) => {
      const categoryId = series.demandCategory.id;

      series.demandSeriesValues.forEach((value) => {
        const date = new Date(value.calendarWeek);
        const year = date.getFullYear();
        const week = getISOWeek(date).toString();

        if (!newDemandValuesMap[categoryId]) {
          newDemandValuesMap[categoryId] = {};
        }
        if (!newDemandValuesMap[categoryId][year]) {
          newDemandValuesMap[categoryId][year] = {};
        }
        newDemandValuesMap[categoryId][year][week] = value.demand;
      });
    });

    setDemandValuesMap(newDemandValuesMap);

    // Set edit mode to false and clear savedChanges
    setEditMode(false);
  };

  return (
      <div className='container'>
        <div className="row">
          <div className="col"></div>
          <div className="col-6 border d-flex align-items-center justify-content-center">
            {demandData.id} - {demandData.materialDescriptionCustomer}
          </div>
          <div className="col d-flex justify-content-end">
            <br />
            <ButtonGroup className="mb-2 align-middle">
              <ToggleButton
                  id="toggle-edit"
                  type="checkbox"
                  variant="secondary"
                  name="edit"
                  value="0"
                  checked={editMode}
                  onChange={() => setEditMode(!editMode)}
              >Edit
              </ToggleButton>
              <Button variant="secondary" name="save" onClick={handleSave} disabled={!editMode}>
                Save
              </Button>
              <Button variant="secondary" name="revert" onClick={handleRevert} disabled={!editMode}>
                Revert Changes
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <br />
        <div className="table-container">
          <div className="container">
            <table className="vertical-table">
              <thead>
              <tr>
                <th className="empty-header-cell"></th>
                <th colSpan={totalWeeksPreviousYear} className="header-cell">
                  {currentYear-1}
                </th>
                <th colSpan={totalWeeksCurrentYear} className="header-cell">
                  {currentYear}
                </th>
                <th colSpan={totalWeeksNextYear} className="header-cell">
                  {currentYear+1}
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
                {[monthsPreviousYear, monthsCurrentYear, monthsNextYear].reduce((acc, curr) => acc.concat(curr), []).map((month) =>
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
              {demandcategories?.sort((a, b) => a.id.localeCompare(b.id))
                      .map((category: DemandCategory) => (
                          <tr key={category.id}>
                            <th className="sticky-header-cell">
                              <div className="sticky-header-content">{category.demandCategoryName}</div>
                            </th>
                            {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) => (
                                <React.Fragment key={`${category.id}-${month.name}-${month.year}`}>
                                  {month.weeks.map((week: number) => (
                                      <td key={`${category.id}-${month.name}-${week}`} className="data-cell">
                                        {editMode ? (
                                            <input
                                                className="table-data-input"
                                                type="text"
                                                defaultValue={
                                                  demandValuesMap[category.id]?.[month.year]?.[week] !== undefined
                                                      ? demandValuesMap[category.id]?.[month.year]?.[week].toString()
                                                      : ''
                                                }
                                                onChange={(event) => {
                                                  const inputValue = event.target.value;
                                                  const numericValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters

                                                  setDemandValuesMap((prevDemandValuesMap) => {
                                                    const categoryMap = {
                                                      ...(prevDemandValuesMap[category.id] || {}),
                                                      [month.year]: {
                                                        ...(prevDemandValuesMap[category.id]?.[month.year] || {}),
                                                      },
                                                    };

                                                    if (inputValue === '' || numericValue === '0') {
                                                      delete categoryMap[month.year]?.[week];

                                                      if (Object.keys(categoryMap[month.year]).length === 0) {
                                                        delete categoryMap[month.year];
                                                      }
                                                    } else if (/^[0-9]\d*$/.test(numericValue)) {
                                                      categoryMap[month.year][week] = parseInt(numericValue, 10);
                                                    }

                                                    return {
                                                      ...prevDemandValuesMap,
                                                      [category.id]: categoryMap,
                                                    };
                                                  });
                                                }}
                                            />
                                        ) : (
                                            <span>
                                  {demandValuesMap[category.id]?.[month.year]?.[week] !== undefined
                                      ? demandValuesMap[category.id]?.[month.year]?.[week] === 0
                                          ? '0'
                                          : demandValuesMap[category.id]?.[month.year]?.[week]
                                      : ''}
                                </span>
                                        )}
                                      </td>
                                  ))}
                                </React.Fragment>
                            ))}
                          </tr>
                      ))}
              </thead>
            </table>
          </div>
        </div>
      </div>
  );
};


export default WeeklyView;