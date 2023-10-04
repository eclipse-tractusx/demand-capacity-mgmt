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

import React, { useContext, useState } from 'react';
import '../../../src/index.css';
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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

const CapacityGroupSumView: React.FC<WeeklyViewProps> = () => {

  const capacityGroup = {
    "capacityGroupId": "50bce75c-6ca9-4c98-ba20-c23ce5d3d632",
    "capacities": [
      {
        "actualCapacity": 10,
        "maximumCapacity": 11,
        "calendarWeek": "2023-06-19"
      }
    ],
    "supplierLocations": [
      {
        "id": "5fe734b9-e7e0-4a84-a9f9-5c08dc5ad29d",
        "bpn": "BPN09",
        "companyName": "GM",
        "street": "Test",
        "number": "Test",
        "zipCode": "Test",
        "country": "Test",
        "myCompany": "Test"
      }
    ],
    "customer": {
      "id": "5fe734b9-e7e0-4a84-a9f9-5c08dc5ad29d",
      "bpn": "BPN09",
      "companyName": "GM",
      "street": "Test",
      "number": "Test",
      "zipCode": "Test",
      "country": "Test",
      "myCompany": "Test"
    },
    "supplier": {
      "id": "5fe734b9-e7e0-4a84-a9f9-5c08dc5ad29d",
      "bpn": "BPN09",
      "companyName": "GM",
      "street": "Test",
      "number": "Test",
      "zipCode": "Test",
      "country": "Test",
      "myCompany": "Test"
    },
    "weekBasedCapacityGroupId": "98458dc9-6dc8-4457-92e7-80e68605dd25",
    "linkedDemandSeries": [
      {
        "id": "5c1d0f5f-e21c-4915-9b0c-c7d8f0adc19c",
        "materialDescriptionCustomer": " Demand001",
        "materialNumberCustomer": "CapacityGroup",
        "materialNumberSupplier": "Test",
        "customer": {
          "id": "5d210fb8-260d-4190-9578-f62f9c459703",
          "bpn": "BPN01",
          "companyName": "CGI",
          "street": "Test",
          "number": "Test",
          "zipCode": "Test",
          "country": "Test",
          "myCompany": "Test"
        },
        "supplier": {
          "id": "5d210fb8-260d-4190-9578-f62f9c459703",
          "bpn": "BPN01",
          "companyName": "CGI",
          "street": "Test",
          "number": "Test",
          "zipCode": "Test",
          "country": "Test",
          "myCompany": "Test"
        },
        "unitMeasureId": {
          "id": "a8ebe2f8-2af8-4573-9dd4-d7f33e682792",
          "codeValue": "un",
          "displayValue": "Unit"
        },
        "changedAt": "2023-09-18T08:55:57.700319",
        "demandSeries": [
          {
            "customerLocation": {
              "id": "5d210fb8-260d-4190-9578-f62f9c459703",
              "bpn": "BPN01",
              "companyName": "CGI",
              "street": "Test",
              "number": "Test",
              "zipCode": "Test",
              "country": "Test",
              "myCompany": "Test"
            },
            "expectedSupplierLocation": [
              {
                "id": "5d210fb8-260d-4190-9578-f62f9c459703",
                "bpn": "BPN01",
                "companyName": "CGI",
                "street": "Test",
                "number": "Test",
                "zipCode": "Test",
                "country": "Test",
                "myCompany": "Test"
              }
            ],
            "demandCategory": {
              "id": "1d185139-0d50-4bb6-9780-b1587da8e7f5",
              "demandCategoryCode": "DC002",
              "demandCategoryName": "Series"
            },
            "demandSeriesValues": [
              {
                "calendarWeek": "2023-06-19T08:55:57.699320",
                "demand": 10.0
              }
            ]
          },
          {
            "customerLocation": {
              "id": "5d210fb8-260d-4190-9578-f62f9c459703",
              "bpn": "BPN01",
              "companyName": "CGI",
              "street": "Test",
              "number": "Test",
              "zipCode": "Test",
              "country": "Test",
              "myCompany": "Test"
            },
            "expectedSupplierLocation": [
              {
                "id": "5d210fb8-260d-4190-9578-f62f9c459703",
                "bpn": "BPN01",
                "companyName": "CGI",
                "street": "Test",
                "number": "Test",
                "zipCode": "Test",
                "country": "Test",
                "myCompany": "Test"
              }
            ],
            "demandCategory": {
              "id": "1622ea81-f454-4800-a15f-16253ae1c93d",
              "demandCategoryCode": "DC006",
              "demandCategoryName": "Default"
            },
            "demandSeriesValues": [
              {
                "calendarWeek": "2023-06-19T08:55:57.699320",
                "demand": 80.0
              }
            ]
          }
        ]
      }
    ],
    "unitOfMeasure": {
      "id": "a8ebe2f8-2af8-4573-9dd4-d7f33e682792",
      "codeValue": "un",
      "displayValue": "Unit"
    },
    "changeAt": "2023-09-12T11:07:30.232298",
    "name": "TEST CAPACITY GROUP"
  };

  const { demandcategories } = useContext(DemandCategoryContext) || {};
  const currentYear = new Date().getFullYear();

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
  let [demandValuesMap] = useState<DemandValuesMap>({});

  //Mapping of categories
  const idToNumericIdMap: Record<string, number> = {};

  if (demandcategories) {
    demandcategories.forEach((category, index) => {
      idToNumericIdMap[category.id] = index;
    });
  }

  console.log(demandValuesMap);

  // Track which Demand.description rows are expanded
  const [expandedDemandRows, setExpandedDemandRows] = useState<Record<string, boolean>>({});

  // Function to toggle the expansion of a Demand.description row
  const toggleDemandRowExpansion = (demandId: string) => {
    setExpandedDemandRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [demandId]: !prevExpandedRows[demandId],
    }));
  };

  // Calculate the sum of demand values for each week
  const demandSums: Record<number, number> = {};
  // Calculate the sum of demandSeriesValues.demand for each week
  const demandSumsByWeek: Record<number, number> = {};


  // Track the sum of the Demands.demand for each Demand.description row
  if (capacityGroup && capacityGroup.linkedDemandSeries) {
    capacityGroup.linkedDemandSeries.forEach((demand) => {
      demand.demandSeries.forEach((demandSeries) => {
        demandSeries.demandSeriesValues.forEach((demandSeriesValue) => {
          const week = getISOWeek(new Date(demandSeriesValue.calendarWeek));
          demandSums[week] = (demandSums[week] || 0) + demandSeriesValue.demand;
        });
      });
    });
  }

  if (capacityGroup && capacityGroup.linkedDemandSeries) {
    capacityGroup.linkedDemandSeries.forEach((demand) => {
      demand.demandSeries.forEach((demandSeries) => {
        demandSeries.demandSeriesValues.forEach((demandSeriesValue) => {
          const week = getISOWeek(new Date(demandSeriesValue.calendarWeek));
          demandSumsByWeek[week] = (demandSumsByWeek[week] || 0) + demandSeriesValue.demand;
        });
      });
    });
  }

  const calculateDelta = (week: number, demandSumsByWeek: Record<number, number>, actualCapacityMap: Record<number, number>) => {
    const demandSum = demandSumsByWeek[week] || 0;
    const actualCapacity = actualCapacityMap[week] || 0;
    return actualCapacity - demandSum ;
  };

  const actualCapacityMap: Record<number, number> = {};

  if (capacityGroup && capacityGroup.capacities) {
    capacityGroup.capacities.forEach((capacity) => {
      const week = getISOWeek(new Date(capacity.calendarWeek));
      actualCapacityMap[week] = capacity.actualCapacity;
    });
  }

  const deltaMap: Record<number, number> = {};

  monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).forEach((month) => {
    month.weeks.forEach((week) => {
      deltaMap[week] = calculateDelta(week, demandSumsByWeek, actualCapacityMap);
    });
  });

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
                  <div className="sticky-header-content" onClick={() => toggleDemandRowExpansion('total')}>
                    {expandedDemandRows['total'] ? '▼' : '▶'} Demands (Sum)
                  </div>
                </th>
                {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                  month.weeks.map((week) => (
                    <td key={`demandTotal-${week}`} className="data-cell ">
                     <strong> {demandSums[week] || '-'}</strong>
                    </td>
                  ))
                )}
              </tr>
              {expandedDemandRows['total'] && (
                <>
                  {capacityGroup &&
                    capacityGroup.linkedDemandSeries &&
                    capacityGroup.linkedDemandSeries.map((demand) => (
                      <React.Fragment key={`demand-row-${demand.id}`}>
                        <tr>
                          <th className="sticky-header-cell">
                            <div
                              className="sticky-header-content table-header-nested-text "
                              onClick={() => toggleDemandRowExpansion(demand.id)}
                            >
                              {expandedDemandRows[demand.id] ? '▼' : '▶'} {demand.materialDescriptionCustomer}
                            </div>
                          </th>
                          {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                            month.weeks.map((week) => (
                              <td key={`demandSeries-${week}-${demand.id}`} className="data-cell">
                                <strong>{demandSumsByWeek[week] || ' '}</strong>
                              </td>
                            ))
                          )}
                        </tr>
                        {expandedDemandRows[demand.id] && (
                          <>
                            {demand.demandSeries.map((demandSeries) => (
                              <React.Fragment key={`demandSeries-row-${demandSeries.demandCategory.id}`}>
                                <tr>
                                  <th className="sticky-header-cell">
                                    <div className="sticky-header-content table-header-nested-text-child">
                                      {demandSeries.demandCategory.demandCategoryName}
                                    </div>
                                  </th>
                                  {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) =>
                                    month.weeks.map((week) => (
                                      <td key={`demandSeries-${week}-${demandSeries.demandCategory.id}`} className="data-cell">
                                        {demandSeries.demandSeriesValues.find(
                                          (demandValue) => getISOWeek(new Date(demandValue.calendarWeek)) === week
                                        )?.demand || ' '}
                                      </td>
                                    ))
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
                      key={`delta-${week}`}
                      className={`data-cell ${deltaMap[week] < 0 ? 'bg-danger text-white' : ''}`}
                    >
                      {deltaMap[week]}
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