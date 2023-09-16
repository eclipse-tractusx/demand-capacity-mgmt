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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import java.util.UUID;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventStatus;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;

public class LoggingHistoryUtils {

    //TODO, Saja: Add the Event of type 'todo'
    public static EventType getEventType(EventStatus eventStatus) {
        if (
            eventStatus == EventStatus.TRANSITIONED_FROM_GREEN_TO_RED ||
            eventStatus == EventStatus.TRANSITIONED_FROM_YELLOW_TO_RED ||
            eventStatus == EventStatus.TRANSITIONED_FROM_GREEN_TO_YELLOW
        ) {
            return EventType.STATUS_IMPROVEMENT;
        } else if (
            eventStatus == EventStatus.TRANSITIONED_FROM_RED_TO_YELLOW ||
            eventStatus == EventStatus.TRANSITIONED_FROM_YELLOW_TO_GREEN ||
            eventStatus == EventStatus.TRANSITIONED_FROM_RED_TO_GREEN
        ) {
            return EventType.STATUS_REDUCTION;
        }
        return EventType.GENERAL_EVENT;
    }
}
