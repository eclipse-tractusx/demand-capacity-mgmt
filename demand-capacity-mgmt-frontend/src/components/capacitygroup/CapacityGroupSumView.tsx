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

import { getISOWeek } from 'date-fns';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FaArrowDown, FaArrowRight, FaRegCalendarCheck } from 'react-icons/fa';
import '../../../src/index.css';
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';
import { SingleCapacityGroup } from '../../interfaces/capacitygroup_interfaces';
import { DemandProp } from "../../interfaces/demand_interfaces";
import { defaultEndDateString, defaultStartDateString } from '../../util/Defaults';
import { generateWeeksForDateRange, getWeekDates } from '../../util/WeeksUtils';

interface WeeklyViewProps {
  capacityGroup: SingleCapacityGroup | null | undefined;
  materialDemands: DemandProp[] | null;
  updateParentDateRange: (start: Date, end: Date) => void;
}

const CapacityGroupSumView: React.FC<WeeklyViewProps> = ({ capacityGroup,
  materialDemands,
  updateParentDateRange
}) => {

  const { demandcategories } = useContext(DemandCategoryContext) || {};

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

  //Mapping of categories
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

  const { demandSums, computedSums } = useMemo(() => {
    const demandSums: Record<number, Record<number, number>> = {};
    const computedSums: Record<number, Record<number, number>> = {};

    if (capacityGroup && materialDemands) {
      materialDemands.forEach((demand) => {
        demand.demandSeries?.forEach((demandSeries) => {
          demandSeries.demandSeriesValues.forEach((demandSeriesValue) => {
            const year = new Date(demandSeriesValue.calendarWeek).getFullYear();
            const week = getISOWeek(new Date(demandSeriesValue.calendarWeek));

            // Populate demandSums
            if (!demandSums[year]) {
              demandSums[year] = {};
            }
            demandSums[year][week] = (demandSums[year][week] || 0) + demandSeriesValue.demand;

            // Populate computedSums
            if (!computedSums[year]) {
              computedSums[year] = {};
            }
            if (!computedSums[year][week]) {
              computedSums[year][week] = 0;
            }
            computedSums[year][week] += demandSeriesValue.demand;
          });
        });
      });
    }

    return { demandSums, computedSums };
  }, [capacityGroup, materialDemands]);



  // Calculate demand sums for each demand name
  const demandSumsByDemandAndWeek: Record<string, Record<number, Record<number, number>>> = {};

  if (capacityGroup && materialDemands) {
    materialDemands.forEach((demand) => {
      const demandName = demand.materialDescriptionCustomer;
      demandSumsByDemandAndWeek[demandName] = {};

      demand.demandSeries?.forEach((demandSeries) => {
        demandSeries.demandSeriesValues.forEach((demandSeriesValue) => {
          const year = new Date(demandSeriesValue.calendarWeek).getFullYear();
          const week = getISOWeek(new Date(demandSeriesValue.calendarWeek));

          if (!demandSumsByDemandAndWeek[demandName][year]) {
            demandSumsByDemandAndWeek[demandName][year] = {};
          }

          demandSumsByDemandAndWeek[demandName][year][week] = (demandSumsByDemandAndWeek[demandName][year][week] || 0) + demandSeriesValue.demand;
        });
      });
    });
  }


  // Batch update actualCapacityMap with year mapping
  const actualCapacityMap: Record<number, Record<number, number>> = useMemo(() => {
    const capacityMap: Record<number, Record<number, number>> = {};
    if (capacityGroup && capacityGroup.capacities) {
      capacityGroup.capacities.forEach((capacity) => {
        const year = new Date(capacity.calendarWeek).getFullYear();
        const week = getISOWeek(new Date(capacity.calendarWeek));

        if (!capacityMap[year]) {
          capacityMap[year] = {};
        }

        capacityMap[year][week] = capacity.actualCapacity;
      });
    }
    return capacityMap;
  }, [capacityGroup]);


  // Calculate deltaMap directly based on demandSumsByWeek and actualCapacityMap
  const deltaMap: Record<number, Record<number, number>> = useMemo(() => {
    const calculatedDeltaMap: Record<number, Record<number, number>> = {};

    // Calculate deltas for each month in weeksForDateRange
    weeksForDateRange.forEach((month) => {
      calculatedDeltaMap[month.year] = calculatedDeltaMap[month.year] || {}; // Set up year if not present

      // Ensure the correct assignment of capacity and demand sums by week
      month.weeks.forEach((week) => {
        calculatedDeltaMap[month.year][week] =
          (actualCapacityMap[month.year]?.[week] || 0) -
          (computedSums[month.year]?.[week] || 0);
      });
    });

    return calculatedDeltaMap;
  }, [computedSums, actualCapacityMap, weeksForDateRange]);


  useEffect(() => {
    setWeeksForDateRange(generateWeeksForDateRange(startDate, endDate));
    updateParentDateRange(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <div className='container-xl'>
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

              <tr>
                <th className="sticky-header-cell">
                  <div className="sticky-header-content" onClick={() => toggleDemandRowExpansion('total')}>
                    {expandedDemandRows['total'] ? <FaArrowDown /> : <FaArrowRight />} Demands (Sum)
                  </div>
                </th>
                {weeksForDateRange.map((month) =>
                  month.weeks.map((week) => {
                    const demandSum = demandSums[month.year]?.[week] || 0;
                    const computedSum = computedSums[month.year]?.[week] || 0;

                    return (
                      <td
                        key={`demand-${week}`}
                        className={`data-cell ${computedSum !== 0 ? 'non-zero-demand-cell' : ''}`}
                        // Assign an ID to each cell to identify it for focusing
                        id={`cell-${week}`}
                      >
                        {demandSum !== 0 ? computedSum : '-'}
                      </td>
                    );
                  })
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
                          {weeksForDateRange.map((month) =>
                            month.weeks.map((week) => {
                              const demandSum =
                                demandSumsByDemandAndWeek[demand.materialDescriptionCustomer]?.[month.year]?.[week] || null;
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
                                  {weeksForDateRange.map((month) =>
                                    month.weeks.map((week) => {
                                      const demandValue = demandSeries.demandSeriesValues.find((demandValue) => {
                                        const valueDate = new Date(demandValue.calendarWeek);
                                        const valueYear = valueDate.getFullYear();
                                        const valueWeek = getISOWeek(valueDate);
                                        return valueYear === month.year && valueWeek === week;
                                      });

                                      const demandSum = demandValue?.demand || null;

                                      return (
                                        <td
                                          key={`demandSeries-${week}-${demandSeries.demandCategory.id}`}
                                          className="data-cell"
                                        >
                                          {demandSum !== null ? demandSum || 0 : '-'}
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

                {weeksForDateRange
                  .reduce<number[]>((acc, curr) => acc.concat(curr.weeks), [])
                  .map((weekNumber) => (
                    <td className="data-cell">
                      {' '}
                    </td>
                  ))}
              </tr>
              <tr>
                <th className="sticky-header-cell">
                  <div className="sticky-header-content">Actual Capacity</div>
                </th>
                {weeksForDateRange.map((month) =>
                  month.weeks.map((week) => {
                    const matchingCapacity = capacityGroup?.capacities.find((capacity) => {
                      const capacityWeek = new Date(capacity.calendarWeek);
                      return getISOWeek(capacityWeek) === week && capacityWeek.getFullYear() === month.year;
                    });
                    const actualCapacity = matchingCapacity?.actualCapacity ?? '-';

                    return (
                      <td key={`actual-capacity-${month.year}-${week}`} className="data-cell">
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
                {weeksForDateRange.map((month) =>
                  month.weeks.map((week) => {
                    const matchingCapacity = capacityGroup?.capacities.find((capacity) => {
                      const capacityWeek = new Date(capacity.calendarWeek);
                      return getISOWeek(capacityWeek) === week && capacityWeek.getFullYear() === month.year;
                    });
                    const maximumCapacity = matchingCapacity?.maximumCapacity ?? '-';

                    return (
                      <td key={`maximum-capacity-${month.year}-${week}`} className="data-cell">
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
                {weeksForDateRange
                  .reduce<number[]>((acc, curr) => acc.concat(curr.weeks), [])
                  .map((weekNumber) => (
                    <td className="data-cell">
                      {' '}
                    </td>
                  ))}
              </tr>

              <tr>
                <th className="sticky-header-cell">
                  <div className="sticky-header-content">Delta</div>
                </th>
                {weeksForDateRange.map((month) =>
                  month.weeks.map((week) => {
                    const deltaValue = deltaMap[month.year]?.[week];
                    const deltaClass =
                      deltaValue !== undefined && deltaValue !== null
                        ? deltaValue < 0
                          ? 'bg-light-red'
                          : deltaValue > 0
                            ? 'bg-light-green'
                            : ''
                        : '';

                    return (
                      <td
                        key={`delta-${month.year}-${week}`}
                        className={`data-cell ${deltaClass}`}
                      >
                        {typeof deltaValue === 'number' && deltaValue > 0 ? `+${deltaValue}` : deltaValue ?? '-'}
                      </td>
                    );
                  })
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