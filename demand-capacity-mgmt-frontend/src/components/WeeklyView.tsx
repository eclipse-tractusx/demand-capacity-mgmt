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

import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { format,getISOWeek} from 'date-fns';
import '../../src/index.css';
import { DemandCategoryContext } from '../contexts/DemandCategoryProvider';
import { Demand, DemandCategory, DemandProp, DemandSeriesValue, MaterialDemandSery } from '../interfaces/demand_interfaces';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { DemandContext } from '../contexts/DemandContextProvider';


interface WeeklyViewProps {
  demandData: DemandProp;
}

//Used to map the ISO week into a Monday, and not the ISO start day (Standart is sunday)
function getISOWeekMonday(year: number, month: string, isoWeek: number): Date {
  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);

  // Calculate the first day of the year
  const startDateOfYear = new Date(year, 0, 1);

  // Calculate the day of the week for the first day of the year (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayOfWeek = startDateOfYear.getDay();

  // Calculate the offset needed to reach the first Monday of the year
  const offsetToMonday = (8 - firstDayOfWeek) % 7;

  // Calculate the start date of the requested ISO week
  const startDateOfRequestedISOWeek = new Date(year, 0, 1 + offsetToMonday + (isoWeek - 1) * 7);

  // Add the month's offset to the start date
  startDateOfRequestedISOWeek.setMonth(monthIndex);

  return startDateOfRequestedISOWeek;
}

function getISOWeekNumber(date: Date): number {
  const newDate = new Date(date);
  const dayOfWeek = newDate.getUTCDay();
  newDate.setUTCDate(newDate.getUTCDate() + 4 - (dayOfWeek || 7));
  const yearStart = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate()) - +yearStart) / 86400000 + 1) / 7);

  // Ensure there are only 52 weeks in a year
  return weekNumber === 0 ? 52 : weekNumber;
}

  // Function to get the number of weeks in a month for a given year and month index
  function getWeeksInMonth(year: number, monthIndex: number): number {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
  
    // Calculate the offset to start weeks on Sunday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const offsetToSunday = (7 - firstDayOfWeek) % 7;
  
    const daysRemaining = daysInMonth - offsetToSunday;
    return Math.ceil(daysRemaining / 7);
  }


const WeeklyView: React.FC<WeeklyViewProps> = ({ demandData }) => {

  const { updateDemand } = useContext(DemandContext)!;
  const { demandcategories } = useContext(DemandCategoryContext) || {};
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const nextYear = currentYear + 1;

  const [editMode, setEditMode] = useState(false);
  const [savedChanges, setSavedChanges] = useState(false); //Future use for toast


  const monthsCurrentYear = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = new Date(currentYear, monthIndex, 1);
    const monthName = format(monthStart, 'MMM');

    let weeks = [];

    if (monthIndex === 0) {
      // For January, generate week numbers 1 to getWeeksInMonth
      weeks = Array.from({ length: getWeeksInMonth(currentYear, monthIndex) }, (_, weekIndex) => weekIndex + 1);
    } else {
      // For other months, calculate ISO week numbers
      weeks = Array.from({ length: getWeeksInMonth(currentYear, monthIndex) }, (_, weekIndex) => {
        const weekNumber = getISOWeekNumber(new Date(currentYear, monthIndex, weekIndex * 7 + 1));
        return weekNumber === 53 ? 1 : weekNumber; // Convert week 53 to week 1 if necessary
      });
    }

    return {
      name: monthName,
      year: currentYear,
      weeks: weeks as number[],
      monthIndex: monthIndex, // Save the monthIndex
    };
  });

  const monthsPreviousYear = [
    { name: 'Dec', year: previousYear, weeks: Array.from({ length: getWeeksInMonth(previousYear, 11) }, (_, index) => index + 48) },
  ];

  const monthsNextYear = [
    { name: 'Jan', year: nextYear, weeks: Array.from({ length: getWeeksInMonth(nextYear, 0) }, (_, index) => index + 1) },
  ];

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


  useEffect(() => {
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
  
    console.log('New Demand Values Map:', newDemandValuesMap);
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
            const isoWeekMonday= getISOWeekMonday(month.year, month.name, week); // Get the Monday of the ISO week
            const demand = demandValuesMap[categoryId]?.[month.year]?.[week];
            if (demand !== undefined) {
              console.log(isoWeekMonday);
              demandSeriesValues.push({
                calendarWeek: format(new Date(month.year, month.monthIndex, isoWeekMonday.getDate()), 'yyyy-MM-dd'),
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
    console.log(updatedDemand);
    if (filteredUpdatedDemandSeries.length > 0) {
      try {
        await updateDemand(updatedDemand);
      } catch (error) {
        console.error('Error updating demand:', error);
      }
    }
  
    setEditMode(false);
    setSavedChanges(true);
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
    setSavedChanges(false);
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
                  {previousYear}
                </th>
                <th colSpan={totalWeeksCurrentYear} className="header-cell">
                  {currentYear}
                </th>
                <th colSpan={totalWeeksNextYear} className="header-cell">
                  {nextYear}
                </th>
              </tr>
              <tr>
                <th className="empty-header-cell"></th>
                {monthsPreviousYear.map((month) =>
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                )}
                {monthsCurrentYear.map((month) =>
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                )}
                {monthsNextYear.map((month) =>
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                )}
              </tr>
              <tr>
                <th className="empty-header-cell"></th>
                {monthsPreviousYear.map((month) =>
                  month.weeks.map((week) =>
                    <th key={month.name + week} className="header-cell week-header-cell">
                      {week}
                    </th>
                  )
                )}
                {monthsCurrentYear.map((month) =>
                  month.weeks.map((week) =>
                    <th key={month.name + week} className="header-cell week-header-cell">
                      {week}
                    </th>
                  )
                )}
                {monthsNextYear.map((month) =>
                  month.weeks.map((week) =>
                    <th key={month.name + week} className="header-cell week-header-cell">
                      {week}
                    </th>
                  )
                )}
              </tr>
              {demandcategories &&
                demandcategories
                  .sort((a, b) => a.id.localeCompare(b.id))
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