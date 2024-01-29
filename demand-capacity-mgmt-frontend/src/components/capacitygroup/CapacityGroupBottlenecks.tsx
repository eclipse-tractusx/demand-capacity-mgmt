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

import { formatISO } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarCheck } from 'react-icons/fa';
import { FcComboChart } from "react-icons/fc";
import { DemandCategoryContext } from '../../contexts/DemandCategoryProvider';
import { YearlyReportContext } from "../../contexts/YearlyReportContextProvider";
import { toCamelCase } from '../../util/WeeksUtils';
import BottleNeckModalComponent from "./BottleNeckModalComponent";

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
            <div className="table-container">
                <div className="container">
                    <table className="vertical-table">
                        <thead>
                            <tr>
                                <th className="sticky-header-cell"></th>
                                {Array.from(new Set(uniqueYearMonths.map(({ year }) => year))).map((year, index) => {
                                    const monthsForYear = uniqueYearMonths.filter(({ year: y }) => y === year).map(({ month }) => month);
                                    return (
                                        <th key={index} colSpan={monthsForYear.length} className="header-cell">{year}</th>
                                    );
                                })}
                            </tr>
                            <tr>
                                <th className="sticky-header-cell"></th>
                                {uniqueYearMonths.map(({ year, month }) => (
                                    <th key={`${year}-${month}`} className="header-cell-btnks">
                                        {toCamelCase(month)}
                                    </th>
                                ))}
                            </tr>
                        </thead>


                        <tbody>
                            {demandcategories.map(category => (
                                <tr key={category.id}>
                                    <td className="sticky-header-cell sticky-header-content"><b>{category.demandCategoryName}</b></td>
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

                                        const baseColor = totalDelta >= 0 ? '157, 207, 75' : '220, 53, 69';
                                        const opacity = hasCategoryData ? 0.9 : 0.11;
                                        const bgColor = `rgba(${baseColor}, ${opacity})`;
                                        const content = hasCategoryData ? (totalDelta === 0 ? '0' : totalDelta.toFixed(2)) : ""; // Display '' (empty) if no category data

                                        return (
                                            <td
                                                key={`${year}-${month}`}
                                                className="data-cell"
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
                    <Table className="table table-responsive-lg">
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
                    <div className="text-muted p-1"><FaRegCalendarCheck /> Data Range (select entire months for accurate week readings)</div>
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

