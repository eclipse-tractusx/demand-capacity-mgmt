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
import {Button, Form, Table, Toast} from 'react-bootstrap';
import {YearlyReportContext} from "../../contexts/YearlyReportContextProvider";
import {DemandCategoryContext} from '../../contexts/DemandCategoryProvider';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {subWeeks, addWeeks, formatISO, startOfDay} from 'date-fns';
import {FaRegCalendarCheck} from 'react-icons/fa';
import '../../../src/index.css';
import {ThresholdProp} from "../../interfaces/Threshold_interfaces";
import {ThresholdsContext} from "../../contexts/ThresholdsContextProvider";
import {FcComboChart} from "react-icons/fc";


interface WeeklyViewProps {
    capacityGroupID: string | null | undefined;
    startDate: string; // Assuming ISO format (YYYY-MM-DD)
    endDate: string; // Assuming ISO format (YYYY-MM-DD)
}


const CapacityGroupBottlenecks: React.FC<WeeklyViewProps> = ({capacityGroupID, startDate, endDate}) => {

    const {yearReports, fetchYearReports} = useContext(YearlyReportContext);
    const {demandcategories} = useContext(DemandCategoryContext) || {};
    const {thresholds} = useContext(ThresholdsContext)!;
    // Use different names for internal date state
    const [internalStartDate, setInternalStartDate] = useState<Date>(new Date(startDate));
    const [internalEndDate, setInternalEndDate] = useState<Date>(new Date(endDate));
    const [selectedThreshold, setSelectedThreshold] = useState<number | null>(null);
    const [editableThresholds, setEditableThresholds] = useState<ThresholdProp[]>([]);
    // Handlers for date change
    const handleInternalStartDateChange = (date: Date) => {
        setInternalStartDate(date);
    };

    const handleInternalEndDateChange = (date: Date) => {
        setInternalEndDate(date);
    };


    useEffect(() => {
        if (selectedThreshold !== null) {
            // Find the threshold object with the selected ID
            const thresholdObj = editableThresholds.find(threshold => threshold.id === selectedThreshold);
            if (thresholdObj) {
                // Extract the percentage from the threshold object
                const percentage = parseFloat(thresholdObj.percentage);

                // Call fetchYearReportsRuled with the necessary parameters
                if (capacityGroupID) {
                    const formattedStartDate = formatISO(internalStartDate, {representation: 'date'});
                    const formattedEndDate = formatISO(internalEndDate, {representation: 'date'});
                    fetchYearReports(capacityGroupID, formattedStartDate, formattedEndDate, true, percentage);
                }
            }
        } else {
            if (capacityGroupID) {
                const formattedStartDate = formatISO(internalStartDate, {representation: 'date'});
                const formattedEndDate = formatISO(internalEndDate, {representation: 'date'});
                fetchYearReports(capacityGroupID, formattedStartDate, formattedEndDate, false, 0);
            }
        }
    }, [selectedThreshold, editableThresholds, capacityGroupID, internalStartDate, internalEndDate, fetchYearReports]);

    useEffect(() => {
        setEditableThresholds(thresholds);
    }, [thresholds]);

    useEffect(() => {
        setSelectedThreshold(null);
    }, [thresholds]);

    const handleCheckboxChange = (id: number) => {
        setSelectedThreshold((prevSelectedThreshold) => {
            if (prevSelectedThreshold === id) {
                return null;
            }
            return id;
        });
    };

    const sortedThresholds = [...editableThresholds].sort((a, b) => {
        return Number(a.percentage) - Number(b.percentage);
    });

    const chunkThresholds = (thresholds: ThresholdProp[], size: number): ThresholdProp[][] => {
        return thresholds.reduce((acc: ThresholdProp[][], val: ThresholdProp, i: number) => {
            let idx = Math.floor(i / size);
            let page = acc[idx] || (acc[idx] = []);
            page.push(val);
            return acc;
        }, []);
    }

    const chunkedThresholds = chunkThresholds(sortedThresholds, 5);

    if (!yearReports) {
        return <div>Loading...</div>;

    }
    const renderTable = () => {
        if (!yearReports || !demandcategories) {
            return <div>Loading...</div>;
        }

        // Create an array of unique year-month combinations
        const uniqueYearMonths = yearReports.flatMap(report =>
            report.monthReport.map(monthReport => ({
                year: report.year,
                month: monthReport.month
            }))
        );

        return (
            <div className="container">
                <div style={{ overflowX: 'auto' }}>
                    <table className="table table-bordered table-sm">
                        <thead>
                        <tr>
                            <th>Demand Category</th>
                            {uniqueYearMonths.map(({ year, month }) => (
                                <th key={`${year}-${month}`} className="text-center">
                                    {month} {year}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {demandcategories.map(category => (
                            <tr key={category.id}>
                                <td>{category.demandCategoryName}</td>
                                {uniqueYearMonths.map(({ year, month }) => {
                                    const monthReport = yearReports.find(report => report.year === year)
                                        ?.monthReport.find(mr => mr.month === month);
                                    const categoryDeltas = monthReport?.weekReport.flatMap(weekReport =>
                                        weekReport.categoryDeltas
                                            .filter(delta => delta.catID === category.id)
                                            .map(delta => ({ ...delta, week: weekReport.week }))
                                    );

                                    let totalDelta = 0;
                                    let tooltipContent = "";
                                    let hasCategoryData = false;
                                    categoryDeltas?.forEach(({ delta, week, catID, catName, catCode }) => {
                                        totalDelta += delta;
                                        tooltipContent += `Week ${week}: ${delta.toFixed(2)}\n`;
                                        if (catID && catName && catCode) {
                                            hasCategoryData = true;
                                        }
                                    });

                                    const baseColor = totalDelta >= 0 ? '148, 203, 45' : '220, 53, 69';
                                    const opacity = hasCategoryData ? 0.9 : 0.5; // Adjust opacity based on category data
                                    const bgColor = `rgba(${baseColor}, ${opacity})`;
                                    const content = hasCategoryData ? totalDelta.toFixed(2) : ""; // Display content only if category data exists

                                    return (
                                        <td
                                            key={`${year}-${month}`}
                                            style={{ textAlign: 'center', backgroundColor: bgColor }}
                                            title={tooltipContent.trim()}
                                        >
                                            {content}
                                        </td>
                                    );
                                })}
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
            <div className="container-xl">
                <div style={{display: "flex"}}>
                    <FcComboChart size={35}/>
                    <h3 className="icon-text-padding">Bottleneck thresholds</h3>
                </div>
                <div style={{display: "flex", alignContent:"center"}}>
                    <p>Thresholds below are provided and enabled by your administrator.</p>
                </div>
                <div style={{overflowX: 'auto'}}>
                    <Table className="table table-bordered table-responsive-lg">
                        <tbody>
                        {chunkedThresholds.map((chunk, chunkIndex) => (
                            <tr key={chunkIndex}>
                                {chunk.map((threshold) => (
                                    <td key={threshold.id}>
                                        <Form.Check
                                            type="checkbox"
                                            id={`threshold-${threshold.percentage}`}
                                            label={`${threshold.percentage} %`}
                                            checked={threshold.id === selectedThreshold}
                                            onChange={() => handleCheckboxChange(threshold.id)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            <div className="date-range-container">
                <div className="pop-out-section">
                    <div className="text-muted p-1"><FaRegCalendarCheck/> Data Range</div>
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
            <Table size="sm">
                <tbody>{renderTable()}</tbody>
            </Table>
        </div>
    );
};

export default CapacityGroupBottlenecks;

//OLD TABLE VERSION BASED ON SUM VIEW

/*const renderTable = () => {
    // Create an array of unique years from the backend data
    const uniqueYears = [...new Set(yearReports.map(report => report.year))];

    return (
        <div className="container">
            <div style={{overflowX: 'auto'}}>
                <table className="table table-bordered table-sm">
                    <thead>
                    <tr>
                        <th></th>
                        {/!* Empty header for demand categories *!/}
                        {uniqueYears.map(year => {
                            const yearData = yearReports.find(report => report.year === year);
                            if (!yearData) return null;

                            // Calculate the colspan based on the number of weeks in the year report
                            const weeksInYear = yearData.monthReport.reduce(
                                (total, month) => total + month.weekReport.length,
                                0
                            );

                            return (
                                <th key={`year-${year}`} colSpan={weeksInYear}
                                    className="text-center">
                                    {year}
                                </th>
                            );
                        })}
                    </tr>
                    <tr>
                        <th>Demand Category</th>
                        {/!* Header for demand categories *!/}
                        {uniqueYears.map(year => (
                            yearReports
                                .filter(report => report.year === year)
                                .flatMap(report =>
                                    report.monthReport.flatMap(month => (
                                        <th className="text-center"
                                            key={`month-${year}-${month.month}`} colSpan={month.weekReport.length}>
                                            {month.month}
                                        </th>
                                    ))
                                )
                        ))}
                    </tr>
                    <tr>
                        <th style={{backgroundColor: 'rgba(128, 128, 128, 0.2)'}}></th>
                        {/!* Empty header for demand categories *!/}
                        {uniqueYears.map(year => (
                            yearReports
                                .filter(report => report.year === year)
                                .flatMap(report =>
                                    report.monthReport.flatMap(month =>
                                        month.weekReport.map(week => (
                                            <th
                                                style={{alignItems: "center"}}
                                                className="text-center" // Add text-center class to center-align the content
                                                key={`week-${year}-${month.month}-${week.week}`}
                                            >
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
                                                        style={{textAlign: 'center', backgroundColor: bgColor}}
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
};*/