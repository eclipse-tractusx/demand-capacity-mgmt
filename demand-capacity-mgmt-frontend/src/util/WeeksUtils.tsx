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

import moment from "moment";

export function getISOWeekMonday(year: number, isoWeek: number): moment.Moment {
    return moment().year(year).isoWeek(isoWeek).startOf('isoWeek');
}

export function getYearOfWeek(date: moment.Moment): number {
    return date.add(3, 'days').year();
}

export function getWeeksInMonth(year: number, monthIndex: number, knownNextMonthWeeks?: Set<number>): number[] {
    const weeks: Set<number> = new Set();

    const firstDayOfMonth = moment().year(year).month(monthIndex).startOf('month');
    const lastDayOfMonth = moment().year(year).month(monthIndex).endOf('month');
    // Fetch weeks of the next month if not provided.
    if (!knownNextMonthWeeks && monthIndex < 11) {
        knownNextMonthWeeks = new Set(getWeeksInMonth(year, monthIndex + 1));
    }

    let currentDay = firstDayOfMonth;
    while (currentDay <= lastDayOfMonth) {
        const weekNum = currentDay.week();
        const isoWeekYear = getYearOfWeek(currentDay);

        // If the month is January and the week year is the previous year, skip it
        if (monthIndex === 0 && isoWeekYear < year) {
            currentDay = currentDay.add(1, 'days');
            continue;
        }

        // If it's the last week of the month and it's also in the next month, skip it.
        if (currentDay.isAfter(moment(new Date(year, monthIndex, 24))) && knownNextMonthWeeks?.has(weekNum)) {
            currentDay = currentDay.add(1, 'days');
            continue;
        }

        weeks.add(weekNum);
        currentDay = currentDay.add(1, 'days');
    }
    return Array.from(weeks).sort((a, b) => a - b);
}


export const generateWeeksForDateRange = (start: Date, end: Date) => {
    const weeks: { name: string; year: number; weeks: number[]; monthIndex: number }[] = [];
    let currentDate = moment(start).startOf('isoWeek');

    while (currentDate.isSameOrBefore(moment(end), 'day')) {
        const year = currentDate.year();
        const monthName = currentDate.format('MMMM');
        const weeksInMonth = getWeeksInMonth(year, currentDate.month());

        const monthIndex = currentDate.month();

        const existingMonthIndex = weeks.findIndex((monthData) => monthData.year === year && monthData.monthIndex === monthIndex);

        if (existingMonthIndex === -1) {
            weeks.push({
                name: monthName,
                year,
                weeks: weeksInMonth,
                monthIndex,
            });
        } else {
            weeks[existingMonthIndex].weeks.push(...weeksInMonth);
        }

        currentDate.add(1, 'month');
    }

    return weeks;
};