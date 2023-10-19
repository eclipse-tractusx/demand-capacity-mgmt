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
import { useEffect, useRef, useState } from "react";
import {
    Bar,
    BarChart,
    Brush,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ReferenceArea,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { CapacityGroupData, SingleCapacityGroup } from "../../interfaces/capacitygroup_interfaces";
import { DemandProp } from "../../interfaces/demand_interfaces";


interface CapacityGroupChronogramProps {
    capacityGroup: SingleCapacityGroup | null;
    materialDemands: DemandProp[] | null;
}

function CapacityGroupChronogram(props: CapacityGroupChronogramProps) {

    type SelectedRangeType = {
        start: string | null;
        end: string | null;
    };


    const [capacityGroup] = useState<SingleCapacityGroup | null>(props.capacityGroup);
    const [demands, setDemands] = useState<DemandProp[] | null>(props.materialDemands);

    useEffect(() => {
        // Update the component's state when materialDemands prop changes
        setDemands(props.materialDemands);
    }, [props.materialDemands]);


    const rawCapacities = capacityGroup?.capacities || [];
    // Calculate demand sums by week
    const demandSumsByWeek: { [key: string]: number } = {};
    if (demands) {
        demands.forEach((demand) => {
            demand.demandSeries?.forEach((demandSeries) => {
                demandSeries.demandSeriesValues.forEach((demandSeriesValue) => {
                    const week = demandSeriesValue.calendarWeek;
                    demandSumsByWeek[week] = (demandSumsByWeek[week] || 0) + demandSeriesValue.demand;
                });
            });
        });
    }

    // Create a mapping of demand sums by calendarWeek
    const demandSumsMap: { [key: string]: number } = {};
    Object.keys(demandSumsByWeek).forEach((week) => {
        const simplifiedDate = new Date(week).toISOString().split('T')[0];
        demandSumsMap[simplifiedDate] = demandSumsByWeek[week];
    });

    // Create data for the chart by matching calendarWeek with demand sums
    const data: CapacityGroupData[] = rawCapacities.map((d) => {
        const simplifiedDate = new Date(d.calendarWeek).toISOString().split('T')[0];
        return {
            ...d,
            Demand: demandSumsMap[simplifiedDate] || 0,
            dateEpoch: new Date(simplifiedDate).getTime(),
            calendarWeek: simplifiedDate,
        };
    }).sort((a, b) => a.dateEpoch - b.dateEpoch);

    const getWeekNumber = (d: Date) => {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

        // Convert the dates to milliseconds for the arithmetic operation
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

    };


    const weekTickFormatter = (tick: string) => {
        const dateParts = tick.split("-").map((part) => parseInt(part, 10));
        const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const weekNumber = getWeekNumber(date);
        return `${weekNumber}`;
    };

    let lastDisplayedMonth = -1;

    const renderMonthTick = (tickProps: any) => {
        const { x, y, payload } = tickProps;
        const { value } = payload;
        const date = new Date(value);
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const pathX = Math.floor(x) + 0.5;
        const month = date.getMonth();

        let content = null;

        // If this month hasn't been displayed yet
        if (month !== lastDisplayedMonth) {
            content = (
                <>
                    <path d={`M${pathX},${y}v${-38}`} stroke="grey" />
                    <text x={x + 20} y={y} textAnchor="middle">{monthNames[month]}</text>
                </>
            );
            lastDisplayedMonth = month;
        }

        return <g>{content}</g>;
    };


    const [selectedRange, setSelectedRange] = useState<SelectedRangeType>({ start: null, end: null });
    type BrushStartEndIndex = {
        startIndex?: number;
        endIndex?: number;
    };

    const timer = useRef(2000);
    const brushIndexesRef = useRef<BrushStartEndIndex | null>(null);

    const handleBrushChange = (newIndex: BrushStartEndIndex) => {
        if (typeof newIndex.startIndex === 'number' && typeof newIndex.endIndex === 'number') {
            brushIndexesRef.current = newIndex;
        }
    };



    useEffect(() => {
        const interval = setInterval(() => {
            if (brushIndexesRef.current?.startIndex !== undefined && brushIndexesRef.current?.endIndex !== undefined) {
                const start = data[brushIndexesRef.current.startIndex].calendarWeek;
                const end = data[brushIndexesRef.current.endIndex].calendarWeek;
                setSelectedRange({ start, end });
            }
        }, timer.current);

        return () => clearInterval(interval);
    }, [data]);

    return (
        <div>
            <ComposedChart
                width={1300}
                height={500}
                data={data}

                margin={{
                    top: 20,
                    right: 80,
                    bottom: 20,
                    left: 20
                }}

            >

                <CartesianGrid stroke="#f5f5f5" />
                <XAxis
                    dataKey="calendarWeek"
                    tickFormatter={weekTickFormatter}
                    tick={{ fontSize: '12px' }}  // Adjust font size here
                />
                <XAxis
                    dataKey="calendarWeek"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={renderMonthTick}
                    height={1}
                    scale="band"
                    xAxisId="month"
                />
                <YAxis label={{ value: "Amount", angle: -90, position: "insideLeft" }} />

                <Tooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ bottom: -10 }} />


                <Bar dataKey="Demand" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="actualCapacity" stroke="#ff7300" />
                <Line type="monotone" dataKey="maximumCapacity" stroke="#8884d8" />
                <Brush
                    y={450}
                    dataKey="calendarWeek"
                    height={20}
                    stroke="#8884d8"
                    onChange={handleBrushChange}
                    startIndex={brushIndexesRef.current?.startIndex}
                    endIndex={brushIndexesRef.current?.endIndex}
                />


            </ComposedChart>

            {/* Mini preview AreaChart */}
            <BarChart
                width={1300}
                height={100}  // Adjust height as needed
                data={data}
                margin={{
                    top: 5,
                    right: 80,
                    bottom: 20,
                    left: 20
                }}
            >
                <CartesianGrid />
                <XAxis dataKey="calendarWeek" hide={true} />
                <Bar type="monotone" dataKey="Demand" fill="#8884d8" stroke="#8884d8" />

                {/* Highlighted area based on the brush selection from the main graph */}
                {selectedRange.start && selectedRange.end && (
                    <ReferenceArea x1={selectedRange.start} x2={selectedRange.end} fill="rgba(255,0,0,0.2)" />
                )}
            </BarChart>
        </div>
    );
}

export default CapacityGroupChronogram;

