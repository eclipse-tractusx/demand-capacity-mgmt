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

import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatISO } from 'date-fns';
import { FaRegCalendarCheck } from 'react-icons/fa';
import { FcComboChart } from "react-icons/fc";
import BottleNeckModalComponent from "./BottleNeckModalComponent";
import { YearlyReportContext } from "../../contexts/YearlyReportContextProvider";
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';

interface WeeklyViewProps {
    capacityGroupID: string | null | undefined;
    startDate: string;
    endDate: string;
}

const CapacityGroupBottlenecks: React.FC<WeeklyViewProps> = ({ capacityGroupID, startDate, endDate }) => {
    const { yearReports, fetchYearReports } = useContext(YearlyReportContext);
    const { demandcategories } = useContext(DemandCategoryContext)!;
    const [internalStartDate, setInternalStartDate] = useState<Date>(new Date(startDate));
    const [internalEndDate, setInternalEndDate] = useState<Date>(new Date(endDate));
    const [selectedThreshold, setSelectedThreshold] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedWeekDeltaData, setSelectedWeekDeltaData] = useState<{ week: number; delta: number }[]>([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

    const parseEnabledPercentages = (percentagesString: string): number[] => {
        return percentagesString
            .replace(/[{}]/g, '')
            .split(',')
            .map(Number)
            .filter(num => !isNaN(num));
    };

    const getEnabledPercentages = (): number[] => {
        const report = yearReports?.find(r => r.capacityGroupId === capacityGroupID);
        return report ? parseEnabledPercentages(report.enabledPercentages) : [];
    };

    const handleCheckboxChange = (percentage: number) => {
        setSelectedThreshold(prevSelected => {
            if (prevSelected === percentage) {
                // Unset the selection if the same checkbox is clicked again
                if (capacityGroupID) {
                    const formattedStartDate = formatISO(internalStartDate, { representation: 'date' });
                    const formattedEndDate = formatISO(internalEndDate, { representation: 'date' });
                    fetchYearReports(capacityGroupID, formattedStartDate, formattedEndDate, false, 0);
                }
                return null;
            } else {
                // Set the new selection and fetch reports accordingly
                if (capacityGroupID) {
                    const formattedStartDate = formatISO(internalStartDate, { representation: 'date' });
                    const formattedEndDate = formatISO(internalEndDate, { representation: 'date' });
                    fetchYearReports(capacityGroupID, formattedStartDate, formattedEndDate, true, percentage);
                }
                return percentage;
            }
        });
    };


    const renderThresholdsSection = () => {
        const enabledPercentages = getEnabledPercentages();
        if (enabledPercentages.length === 0) {
            return null; // Return null if there are no enabled percentages
        }

        return (
            <tr>
                {enabledPercentages.map((percentage, index) => (
                    <td key={index}>
                        <Form.Check
                            type="checkbox"
                            id={`threshold-${percentage}`}
                            label={`${percentage} %`}
                            checked={percentage === selectedThreshold}
                            onChange={() => handleCheckboxChange(percentage)}
                        />
                    </td>
                ))}
            </tr>
        );
    };

    useEffect(() => {
        if (capacityGroupID) {
            const formattedStartDate = formatISO(internalStartDate, { representation: 'date' });
            const formattedEndDate = formatISO(internalEndDate, { representation: 'date' });
            fetchYearReports(capacityGroupID, formattedStartDate, formattedEndDate, false, 0);
        }
    }, [capacityGroupID, internalStartDate, internalEndDate, fetchYearReports]);

    const handleInternalStartDateChange = (date: Date) => setInternalStartDate(date);
    const handleInternalEndDateChange = (date: Date) => setInternalEndDate(date);


    const handleTableCellClick = (selectedMonth: string, selectedWeekDeltaData: any[], categoryName: string) => {
        setSelectedMonth(selectedMonth);
        setSelectedWeekDeltaData(selectedWeekDeltaData);
        setSelectedCategoryName(categoryName); // Pass the category name to the state
        setShowModal(true);
    };

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
                                    const monthReport = yearReports.find(report => report.year === year)?.monthReport.find(mr => mr.month === month);
                                    const categoryDeltas = monthReport?.weekReport.flatMap(weekReport =>
                                        weekReport.categoryDeltas
                                            .filter(delta => delta.catID === category.id)
                                            .map(delta => ({ week: weekReport.week, delta: delta.delta, catName: delta.catName }))
                                    );

                                    let totalDelta = 0;
                                    let tooltipContent = "";
                                    let hasCategoryData = false;

                                    categoryDeltas?.forEach(({ delta, week, catName }) => {
                                        totalDelta += delta;
                                        tooltipContent += `Week ${week}: ${delta.toFixed(2)}\n`;
                                        if (week !== undefined && delta !== undefined) { // Check if week and delta exist
                                            hasCategoryData = true;
                                        }
                                    });

                                    const baseColor = totalDelta >= 0 ? '148, 203, 45' : '220, 53, 69';
                                    const opacity = hasCategoryData ? 0.9 : 0.5;
                                    const bgColor = `rgba(${baseColor}, ${opacity})`;
                                    const content = hasCategoryData ? (totalDelta === 0 ? '0' : totalDelta.toFixed(2)) : ""; // Display '' (empty) if no category data

                                    return (
                                        <td
                                            key={`${year}-${month}`}
                                            style={{ textAlign: 'center', backgroundColor: bgColor, cursor: 'pointer' }}
                                            onClick={() => handleTableCellClick(`${month} ${year}`, categoryDeltas || [], category.demandCategoryName)}
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
                <div style={{ display: "flex" }}>
                    <FcComboChart size={35} />
                    <h3 className="icon-text-padding">Bottleneck thresholds</h3>
                </div>
                <div style={{ display: "flex", alignContent: "center" }}>
                    <p>Thresholds below are provided and enabled by your administrator.</p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <Table className="table table-bordered table-responsive-lg">
                        <tbody>
                        <tr>
                            {renderThresholdsSection()}
                        </tr>
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
            <BottleNeckModalComponent
                showModal={showModal}
                setShowModal={setShowModal}
                selectedMonth={selectedMonth}
                selectedWeekDeltaData={selectedWeekDeltaData}
                categoryName={selectedCategoryName}
            />
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