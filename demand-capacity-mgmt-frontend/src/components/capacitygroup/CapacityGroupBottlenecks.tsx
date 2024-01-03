import React, { Component } from 'react';
import '../../../src/index.css';
import {
    getISOWeek,
    startOfWeek,
    startOfYear,
    endOfYear,
    eachWeekOfInterval, endOfWeek, addWeeks
} from 'date-fns';

interface WeekInfo {
    weekNumber: number;
}

interface Month {
    year: number;
    name: string;
    weeks: WeekInfo[];
}

interface BottleneckData {
    week: number;
    delta: number;
    bottleneck: number;
}

interface CapacityGroupBottlenecksState {
    data: BottleneckData[];
    months: Month[];
}

class CapacityGroupBottlenecks extends Component<{}, CapacityGroupBottlenecksState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            data: [],
            months: []
        };
    }

    componentDidMount() {
        this.initializeData();
    }

    initializeData = () => {
        const currentYear = new Date().getFullYear();
        const weeksOfYear = this.getWeeksOfYear(currentYear);
        const months = this.populateMonths(weeksOfYear); // Corrected to pass only one argument

        // Generate bottleneck data for each week of the current year
        const data: BottleneckData[] = weeksOfYear.map((weekInfo, index) => ({
            week: weekInfo.weekNumber,
            delta: Math.floor(Math.random() * 50),
            bottleneck: Math.floor(Math.random() * 100),
        }));

        this.setState({ data, months });
    };

    getWeeksOfYear = (year: number): WeekInfo[] => {
        // Get all weeks that fall within the current year, including ones from the last or next year.
        const start = startOfYear(new Date(year, 0, 1));
        const end = endOfYear(new Date(year, 11, 31));
        const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

        // Filter to ensure unique weeks, taking into account the last week of the previous year and the first week of the next year.
        const weekNumbers = weeks.map(date => getISOWeek(date));
        const uniqueWeekNumbers = Array.from(new Set(weekNumbers));

        return uniqueWeekNumbers.map(weekNumber => ({ weekNumber }));
    };

    populateMonths = (weeksOfYear: WeekInfo[]): Month[] => {
        const year = new Date().getFullYear();
        const months: Month[] = [];

        // Initialize months with empty weeks
        for (let i = 0; i < 12; i++) {
            months.push({
                year,
                name: new Date(year, i).toLocaleString('default', { month: 'short' }),
                weeks: []
            });
        }

        // Helper function to get the month index for a given date
        const getMonthIndex = (date: Date) => {
            const month = date.getMonth();
            const firstDayOfMonth = startOfWeek(new Date(year, month, 1), { weekStartsOn: 1 });
            return date >= firstDayOfMonth ? month : month - 1;
        };

        // Distribute weeks into months
        weeksOfYear.forEach(weekInfo => {
            // Get the start date of the week
            const weekStartDate = addWeeks(startOfYear(new Date(year, 0, 1)), weekInfo.weekNumber - 1);
            const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 });

            // Determine the month for the start and end of the week
            const startMonthIndex = getMonthIndex(weekStartDate);
            const endMonthIndex = getMonthIndex(weekEndDate);

            // Add the week to the start month
            if (!months[startMonthIndex].weeks.find(w => w.weekNumber === weekInfo.weekNumber)) {
                months[startMonthIndex].weeks.push(weekInfo);
            }

            // If the week spans two months, add it to the end month as well
            if (startMonthIndex !== endMonthIndex) {
                if (!months[endMonthIndex].weeks.find(w => w.weekNumber === weekInfo.weekNumber)) {
                    months[endMonthIndex].weeks.push(weekInfo);
                }
            }
        });

        // Sort the weeks within each month
        months.forEach(month => {
            month.weeks.sort((a, b) => a.weekNumber - b.weekNumber);
        });

        return months;
    };

    getBottleneckColor = (bottleneck: number): string => {
        if (bottleneck > 75) {
            console.log("Class: bottleneck-green");
            return 'bottleneck-green';
        }
        if (bottleneck > 50) {
            console.log("Class: bottleneck-yellow");
            return 'bottleneck-yellow';
        }
        console.log("Class: bottleneck-red");
        return 'bottleneck-red';
    };


    render() {
        const { data, months } = this.state;

        return (
            <div className='container mt-3'>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                        <tr>
                            {/* Year header spanning all columns */}
                            <th scope="col" className="text-center" colSpan={53}>2024</th>
                        </tr>
                        <tr>
                            {/* Month headers */}
                            {months.map((month) => (
                                <th key={month.name} className="text-center" colSpan={month.weeks.length}>
                                    {month.name}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            {months.map((month) => (
                                month.weeks.map((week) => (
                                    <td
                                        key={week.weekNumber}
                                        className={`text-center ${this.getBottleneckColor(data.find(d => d.week === week.weekNumber)?.bottleneck ?? 0)}`}
                                    >
                                        <div><strong>{week.weekNumber}</strong></div>
                                        <div>{data.find(d => d.week === week.weekNumber)?.bottleneck ?? '-'}</div>
                                    </td>
                                ))
                            ))}
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default CapacityGroupBottlenecks;
