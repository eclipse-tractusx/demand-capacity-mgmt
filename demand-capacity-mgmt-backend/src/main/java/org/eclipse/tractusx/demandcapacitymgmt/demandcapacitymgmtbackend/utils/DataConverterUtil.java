/*
 * *******************************************************************************
 *   Copyright (c) 2023 BMW AG
 *   Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *   See the NOTICE file(s) distributed with this work for additional
 *   information regarding copyright ownership.
 *
 *   This program and the accompanying materials are made available under the
 *   terms of the Apache License, Version 2.0 which is available at
 *   https://www.apache.org/licenses/LICENSE-2.0.
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *   WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *   License for the specific language governing permissions and limitations
 *   under the License.
 *
 *   SPDX-License-Identifier: Apache-2.0
 *   ********************************************************************************
 *
 */

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.util.List;
import lombok.experimental.UtilityClass;

public class DataConverterUtil {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static LocalDateTime convertFromString(String date) {
        LocalDate ld = LocalDate.parse(date, formatter);
        return LocalDateTime.of(ld, LocalDateTime.now().toLocalTime());
    }

    public static Boolean itsMonday(String date) {
        LocalDateTime localDateTime = convertFromString(date);
        String dayOfWeek = localDateTime.getDayOfWeek().toString();
        return "MONDAY".equals(dayOfWeek);
    }

    public static Boolean checkListAllMonday(List<LocalDateTime> dates) {
        return dates.stream().allMatch(dateTime -> dateTime.getDayOfWeek() == DayOfWeek.MONDAY);
    }

    public static Boolean checkDatesSequence(List<LocalDateTime> dates) {
        boolean isSequentialWeeks = true;
        for (int i = 0; i < dates.size() - 1; i++) {
            LocalDateTime currentDateTime = dates.get(i);
            LocalDateTime nextDateTime = dates.get(i + 1);
            if (
                nextDateTime.getLong(ChronoField.ALIGNED_WEEK_OF_YEAR) !=
                currentDateTime.getLong(ChronoField.ALIGNED_WEEK_OF_YEAR) +
                1
            ) {
                isSequentialWeeks = false;
                break;
            }
        }
        return isSequentialWeeks;
    }
}
