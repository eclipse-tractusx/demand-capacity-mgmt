import React, { Component } from 'react';
import {
    getISOWeek,
    startOfWeek,
    addWeeks,
    endOfWeek,
    getMonth,
    startOfYear,
    endOfYear,
    eachWeekOfInterval
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

        // Create Month objects for each month
        for (let i = 0; i < 12; i++) {
            months.push({
                year,
                name: new Date(year, i).toLocaleString('default', { month: 'short' }),
                weeks: []
            });
        }

        // Assign weeks to the correct month
        weeksOfYear.forEach(weekInfo => {
            const date = startOfWeek(new Date(year, 0, (weekInfo.weekNumber - 1) * 7 + 1), { weekStartsOn: 1 });
            const monthIndex = date.getMonth();
            const weekYear = date.getFullYear();

            // Handle year transition
            if (weekYear === year || (weekYear < year && monthIndex === 11)) {
                months[monthIndex].weeks.push(weekInfo);
            } else if (weekYear > year && monthIndex === 0) {
                months[11].weeks.push(weekInfo); // Assign to December if it's the first week of next year
            }
        });

        return months;
    };

    getBottleneckColor = (bottleneck: number): string => {
        if (bottleneck > 75) return 'bg-danger';
        if (bottleneck > 50) return 'bg-warning';
        return 'bg-success';
    };

    render() {
        const { data, months } = this.state;

        // Concatenate all the weeks from each month to create the `allWeeks` array
        const allWeeks = months.flatMap(month => month.weeks);
        return (
            <div className='container'>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th></th> {/* Empty header for description column */}
                            {months.map((month: Month) => (
                                <th key={month.name} colSpan={month.weeks.length}>
                                    {month.name} {month.year}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th></th> {/* Empty header for week numbers */}
                            {allWeeks.map((weekInfo: WeekInfo, index: number) => (
                                <th key={`week-${index}`} className="text-center">
                                    {weekInfo.weekNumber}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Delta</th>
                            {data.map((item, index) => (
                                <td key={`delta-${index}`} className="text-center">
                                    {item.delta}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <th>Bottleneck %</th>
                            {data.map((item, index) => (
                                <td key={`bottleneck-${index}`} className={this.getBottleneckColor(item.bottleneck)}>
                                    {item.bottleneck}%
                                </td>
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
