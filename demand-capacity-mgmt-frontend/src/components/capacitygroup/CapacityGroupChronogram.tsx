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
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, Brush
} from "recharts";
import {SingleCapacityGroup} from "../../interfaces/capacitygroup_interfaces";

type CapacityGroupChronogramProps = {
    capacityGroup: SingleCapacityGroup | null | undefined;
};

const computeLinkedDemandSum = (capacityGroup: SingleCapacityGroup | null | undefined) => {
    if (!capacityGroup || !capacityGroup.linkedDemandSeries) return 0;

    return capacityGroup.linkedDemandSeries.length;
};

function CapacityGroupChronogram(props: CapacityGroupChronogramProps) {
    const { capacityGroup } = props;

    const rawCapacities = capacityGroup?.capacities || [];


    const linkedDemandSum = computeLinkedDemandSum(capacityGroup);


    // Sorted data by date
    const data = rawCapacities.map(d => ({
        ...d,
        Demand: linkedDemandSum,
        dateEpoch: new Date(d.calendarWeek).getTime()
    })).sort((a, b) => a.dateEpoch - b.dateEpoch);

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



    return (
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

            <CartesianGrid stroke="#f5f5f5"/>
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
            <YAxis label={{value: "Amount", angle: -90, position: "insideLeft"}}/>

            <Tooltip/>
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ bottom: -10 }}/>


            <Bar dataKey="Demand" barSize={20} fill="#413ea0"/>
            <Line type="monotone" dataKey="actualCapacity" stroke="#ff7300"/>
            <Line type="monotone" dataKey="MaximumCapacity"  stroke="#8884d8"/>
            <Brush y={450} dataKey="calendarWeek" height={20} stroke="#8884d8" />
        </ComposedChart>
    );
}

export default CapacityGroupChronogram;

