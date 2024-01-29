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

import moment from 'moment';
import 'moment-weekday-calc';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, ButtonGroup, OverlayTrigger, ToggleButton, Tooltip } from 'react-bootstrap';
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';
import { DemandContext } from '../../contexts/DemandContextProvider';
import '../../index.css';
import { Demand, DemandCategory, DemandProp, DemandSeriesValue, MaterialDemandSery } from '../../interfaces/demand_interfaces';

import { addWeeks, formatISO, getISOWeek, subWeeks } from 'date-fns';
import { startOfDay } from 'date-fns/esm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { generateWeeksForDateRange, getISOWeekMonday } from '../../util/WeeksUtils';
import { LoadingGatheringDataMessage } from '../common/LoadingMessages';

interface WeeklyViewProps {
  demandId: string;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ demandId }) => {
  const { updateDemand } = useContext(DemandContext)!;
  const { demandcategories } = useContext(DemandCategoryContext) ?? {};
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const { getDemandbyId } = useContext(DemandContext)!;
  const [demandData, setDemandData] = useState<DemandProp>();

  const navigate = useNavigate();

  const fetchDemandData = useCallback(async () => {
    try {
      const demand = await getDemandbyId(demandId);
      if (!demand) {
        navigate('/error');
        return;
      }
      setDemandData(demand);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching demand data:', error);
      navigate('/error');
    }
  }, [demandId, getDemandbyId, setDemandData, navigate]);


  const currentDate = startOfDay(new Date());
  const defaultStartDateString = formatISO(subWeeks(currentDate, 8), { representation: 'date' });
  const defaultEndDateString = formatISO(addWeeks(currentDate, 53), { representation: 'date' });

  const [startDate, setStartDate] = useState<Date>(new Date(defaultStartDateString));
  const [endDate, setEndDate] = useState<Date>(new Date(defaultEndDateString));
  const [weeksForDateRange, setWeeksForDateRange] = useState<
    { name: string; year: number; weeks: number[]; monthIndex: number }[]
  >([]);

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      const adjustedEndDate = endDate && date.getTime() > endDate.getTime() ? date : endDate;
      setStartDate(date);
      setEndDate(adjustedEndDate);
      setWeeksForDateRange(generateWeeksForDateRange(date, adjustedEndDate));
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const adjustedStartDate = startDate && date.getTime() < startDate.getTime() ? date : startDate;
      setStartDate(adjustedStartDate);
      setEndDate(date);
      setWeeksForDateRange(generateWeeksForDateRange(adjustedStartDate, date));
    }
  };


  useEffect(() => {
    fetchDemandData();
    setWeeksForDateRange(generateWeeksForDateRange(startDate, endDate));
  }, [fetchDemandData, startDate, endDate]);

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
    const newDemandValuesMap: DemandValuesMap = {};

    demandData?.demandSeries?.forEach((series) => {
      const categoryId = series.demandCategory.id;

      series.demandSeriesValues.forEach((value) => {
        const date = moment(value.calendarWeek);
        const year = date.year();
        const week = date.week();

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
    if (!demandData?.demandSeries) {
      return;
    }

    // Create new MaterialDemandSery objects for categories with data
    const updatedDemandSeries: (MaterialDemandSery | null)[] = demandcategories!.map((category) => {
      const categoryId = category.id;
      const demandSeriesValues: DemandSeriesValue[] = [];

      // Check if there is data for this category in demandValuesMap
      if (demandValuesMap[categoryId]) {
        Object.entries(demandValuesMap[categoryId]).forEach(([year, yearData]) => {
          Object.entries(yearData).forEach(([week, demand]) => {
            const isoWeekMonday = getISOWeekMonday(parseInt(year), parseInt(week));
            demandSeriesValues.push({
              calendarWeek: isoWeekMonday.format('YYYY-MM-DD'),
              demand: demand,
            });
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
      customerId: demandData.customer.id, //NEEDS to be ID associated with logged in user if user is Customer
      supplierId: demandData.supplier.id,
      materialDemandSeries: filteredUpdatedDemandSeries,
      materialDescriptionCustomer: demandData.materialDescriptionCustomer,
      materialNumberCustomer: demandData.materialNumberCustomer,
      materialNumberSupplier: demandData.materialNumberSupplier,
      unitMeasureId: demandData.unitMeasureId.id,
    };

    console.log(updatedDemand)
    // Perform save operation with updatedDemandData
    if (filteredUpdatedDemandSeries.length > 0) {
      try {
        await updateDemand(updatedDemand);
        fetchDemandData();
        // Force data reload after successfully saving
      } catch (error) {
        console.error('Error updating demand:', error);
        setIsLoading(false); // Set loading state to false in case of an error during reload
      }
    } else {
      setEditMode(false);
    }
  };

  const handleRevert = () => {
    // Reload data from demandData
    // This can be done by updating the demandValuesMap with the original data from demandData
    const newDemandValuesMap: DemandValuesMap = {};

    demandData?.demandSeries?.forEach((series) => {
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

  if (isLoading) {
    return <LoadingGatheringDataMessage />;
  }

  return (
    <div className='container'>
      <div className="row">
        <div className="col"></div>
        <div className="col-6 border d-flex align-items-center justify-content-center">
          {demandData?.id} - {demandData?.materialDescriptionCustomer}
        </div>

        <div className="col d-flex justify-content-end">
          <br />        {user?.role === 'CUSTOMER' && (
            <ButtonGroup className="mb-2 align-middle">
              <ToggleButton
                id="toggle-edit"
                type="checkbox"
                variant="info"
                name="edit"
                value="0"
                checked={editMode}
                onChange={() => setEditMode(!editMode)}
              >Edit
              </ToggleButton>
              <Button variant="info" name="save" onClick={handleSave} disabled={!editMode}>
                Save
              </Button>
              <Button variant="info" name="revert" onClick={handleRevert} disabled={!editMode}>
                Revert Changes
              </Button>
            </ButtonGroup>)}
        </div>
        <div className="data-range-container">
          <div className="pop-out-section">
            <div className="text-muted p-1"> <FaRegCalendarCheck /> Data Range</div>
            <div className="col-12 p-1 d-flex form-group align-items-center">
              <DatePicker
                className="form-control"
                selected={startDate}
                onChange={(date) => handleStartDateChange(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select a Start Date"
                showYearDropdown
                showMonthDropdown
                showWeekNumbers
              />
              <span className="mx-3">-</span>
              <DatePicker
                className="form-control"
                selected={endDate}
                onChange={(date) => handleEndDateChange(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Select a End Date"
                showMonthDropdown
                showYearDropdown
                showWeekNumbers
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="container">
          <table className="vertical-table">
            <thead>
              <tr>
                <th className="empty-header-cell"></th>

                {weeksForDateRange.reduce((acc: { year: number; weeks: number }[], monthData) => {
                  const existingYearIndex = acc.findIndex((data) => data.year === monthData.year);
                  if (existingYearIndex === -1) {
                    acc.push({ year: monthData.year as number, weeks: monthData.weeks.length as number });
                  } else {
                    acc[existingYearIndex].weeks += monthData.weeks.length;
                  }
                  return acc;
                }, []).map((yearData, index) => (
                  <th
                    key={`year-${yearData.year}`}
                    colSpan={yearData.weeks}
                    className="header-cell"
                  >
                    {yearData.year}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="empty-header-cell"></th>
                {/* Render headers based on data */}
                {weeksForDateRange.map((monthData) => (
                  <th
                    key={`${monthData.name}-${monthData.year}`}
                    colSpan={monthData.weeks.length}
                    className="header-cell"
                  >
                    {monthData.name}
                  </th>
                ))}
              </tr>


              <tr>
                <th className="empty-header-cell"></th>
                {weeksForDateRange.reduce<number[]>((acc, curr) => acc.concat(curr.weeks), []).map((week) => {
                  // Find the relevant monthData for the current week
                  const monthData = weeksForDateRange.find((month) => month.weeks.includes(week));

                  if (!monthData) {
                    // Handle the case where monthData is not found
                    return null;
                  }

                  return (
                    <th className="header-cell week-header-cell">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`week-tooltip-${week}`}>
                            {`Week ${week} - ${getWeekDates(monthData.year, monthData.name, week).startDate} to ${getWeekDates(
                              monthData.year,
                              monthData.name,
                              week
                            ).endDate}`}
                          </Tooltip>
                        }
                      >
                        <span id={`week-${week}`} className=''>{week}</span>
                      </OverlayTrigger>
                    </th>

                  );
                })}
              </tr>
              {demandcategories?.sort((a, b) => a.id.localeCompare(b.id)).map((category: DemandCategory) => (
                <tr key={category.id}>
                  <th className="sticky-header-cell">
                    <div className="sticky-header-content">{category.demandCategoryName}</div>
                  </th>
                  {weeksForDateRange.map((month) => (
                    month.weeks.map((week: number, index: number) => (
                      <td key={`${category.id}-${month.year}-${month.name}-${week}-${index}`} className="data-cell">
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
                    ))
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