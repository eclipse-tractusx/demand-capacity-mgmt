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
import React from "react";

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


const rawData = [
    {
        name: "Page A",
        date: "2000-02-06",
        ActualCapacity: 590,
        Demand: 800,
        MaximumCapacity: 1400,
        cnt: 490
    },
    {
        name: "Page B",
        date: "2000-05-06",
        ActualCapacity: 868,
        Demand: 967,
        MaximumCapacity: 1506,
        cnt: 590
    },
    {
        name: "Page C",
        date:"2000-04-06",
        ActualCapacity: 1397,
        Demand: 1098,
        MaximumCapacity: 989,
        cnt: 350
    },
    {
        name: "Page D",
        date: "2000-07-22",
        ActualCapacity: 1480,
        Demand: 1200,
        MaximumCapacity: 1228,
        cnt: 480
    },
    {
        name: "Page E",
        date: "2000-09-20",
        ActualCapacity: 1520,
        Demand: 1108,
        MaximumCapacity: 1100,
        cnt: 460
    },
    {
        name: "Page F",
        date: "2001-12-04",
        ActualCapacity: 1400,
        Demand: 680,
        MaximumCapacity: 1700,
        cnt: 380
    },

    {
        name: "Page G",
        date: "2002-01-10",
        ActualCapacity: 1450,
        Demand: 705,
        MaximumCapacity: 1650,
        cnt: 390
    },
    {
        name: "Page H",
        date: "2002-02-15",
        ActualCapacity: 1500,
        Demand: 720,
        MaximumCapacity: 1620,
        cnt: 395
    },
    {
        name: "Page Z",
        date: "2003-11-20",
        ActualCapacity: 1525,
        Demand: 735,
        MaximumCapacity: 1725,
        cnt: 400
    },
    {
        name: "Page x",
        date: "2003-10-25",
        ActualCapacity: 1550,
        Demand: 745,
        MaximumCapacity: 1750,
        cnt: 405
    },

    {
        name: "Page A",
        date: "2004-01-06",
        ActualCapacity: 590,
        Demand: 800,
        MaximumCapacity: 1400,
        cnt: 490
    },
    {
        name: "Page B",
        date: "2004-02-06",
        ActualCapacity: 868,
        Demand: 967,
        MaximumCapacity: 1506,
        cnt: 590
    },
    {
        name: "Page C",
        date:"2004-03-06",
        ActualCapacity: 1397,
        Demand: 1098,
        MaximumCapacity: 989,
        cnt: 350
    },
    {
        name: "Page D",
        date: "2004-04-22",
        ActualCapacity: 1480,
        Demand: 1200,
        MaximumCapacity: 1228,
        cnt: 480
    },
    {
        name: "Page E",
        date: "2004-05-20",
        ActualCapacity: 1520,
        Demand: 1108,
        MaximumCapacity: 1100,
        cnt: 460
    },
    {
        name: "Page F",
        date: "2004-06-04",
        ActualCapacity: 1400,
        Demand: 680,
        MaximumCapacity: 1700,
        cnt: 380
    },

    {
        name: "Page G",
        date: "2004-07-10",
        ActualCapacity: 1450,
        Demand: 705,
        MaximumCapacity: 1650,
        cnt: 390
    },
    {
        name: "Page H",
        date: "2004-08-15",
        ActualCapacity: 1500,
        Demand: 720,
        MaximumCapacity: 1620,
        cnt: 395
    },
    {
        name: "Page Z",
        date: "2004-09-20",
        ActualCapacity: 1525,
        Demand: 735,
        MaximumCapacity: 1725,
        cnt: 400
    },
    {
        name: "Page AA",
        date: "2023-10-25",
        ActualCapacity: 1550,
        Demand: 745,
        MaximumCapacity: 1750,
        cnt: 405
    },

    {
        name: "Page AA",
        date: "2004-11-25",
        ActualCapacity: 1550,
        Demand: 745,
        MaximumCapacity: 1750,
        cnt: 405
    },
    {
        name: "Page AA",
        date: "2004-12-1",
        ActualCapacity: 1550,
        Demand: 745,
        MaximumCapacity: 1750,
        cnt: 405
    },

    {
        name: "Page AA",
        date: "2004-12-9",
        ActualCapacity: 1550,
        Demand: 745,
        MaximumCapacity: 1750,
        cnt: 405
    },
];

// Sorted data by date
const data = rawData.map(d => ({
    ...d,
    dateEpoch: new Date(d.date).getTime()
})).sort((a, b) => a.dateEpoch - b.dateEpoch);


function CapacityGroupChronogram() {

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
        return `W${weekNumber}`;
    };

    let lastDisplayedMonth = -1;  // Initialized to an invalid month number

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

        let monthNameContent = null;

        // If this month hasn't been displayed yet
        if (month !== lastDisplayedMonth) {
            monthNameContent = <text x={x + 20} y={y} textAnchor="middle">{monthNames[month]}</text>;
            lastDisplayedMonth = month;
        }

        return (
            <g>
                <path d={`M${pathX},${y}v${-38}`} stroke="red" />
                {monthNameContent}
            </g>
        );
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
            <XAxis dataKey="date" tickFormatter={weekTickFormatter} />
            <XAxis
                dataKey="date"
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
            <Line type="monotone" dataKey="ActualCapacity" stroke="#ff7300"/>
            <Line type="monotone" dataKey="MaximumCapacity"  stroke="#8884d8"/>
            <Brush y={450} dataKey="date" height={20} stroke="#8884d8" />
        </ComposedChart>
    );
}

export default CapacityGroupChronogram;

