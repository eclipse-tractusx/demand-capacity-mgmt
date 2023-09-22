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

import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.CapacityDeviation;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.StatusColor;

public class StatusManager {

    public static StatusColor getStatusColor(double demand, double maxCapacity, double actualCapacity) {
        CapacityDeviation capacityDeviation = CapacityDeviation.ZERO;
        if (demand > maxCapacity) {
            capacityDeviation = CapacityDeviation.BOTTLENECK;
        } else if (demand > actualCapacity && demand < maxCapacity) {
            capacityDeviation = CapacityDeviation.BOTTLENECK;
        } else if (demand < actualCapacity) {
            capacityDeviation = CapacityDeviation.SURPLUS;
        }
        return capacityDeviation.getStatusColor();
    }

    public static EventType getEventType(
        boolean isMaterialDemandLinkedToCG,
        StatusColor oldStatusColor,
        StatusColor newStatusColor
    ) {
        if (!isMaterialDemandLinkedToCG) return EventType.TODO;
        if (newStatusColor == oldStatusColor) {
            return EventType.GENERAL_EVENT;
        }
        if (
            newStatusColor == StatusColor.GREEN ||
            (oldStatusColor == StatusColor.RED && newStatusColor == StatusColor.YELLOW)
        ) {
            return EventType.STATUS_IMPROVEMENT;
        }
        if (
            newStatusColor == StatusColor.RED ||
            (oldStatusColor == StatusColor.GREEN && newStatusColor == StatusColor.YELLOW)
        ) {
            return EventType.STATUS_REDUCTION;
        }

        return EventType.GENERAL_EVENT;
    }
}
