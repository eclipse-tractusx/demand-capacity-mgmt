/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023, 2024 Contributors to the Eclipse Foundation
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

package org.eclipse.tractusx.demandcapacitymgm.backend.models;

import java.time.LocalDateTime;

public class MaterialCapacityQuantity {

    private double maximumCapacity;
    private double actualCapacity;
    private LocalDateTime calendarWeek;
    private double demand;

    private int materialDemandOrder;

    public MaterialCapacityQuantity(
        double maximumCapacity,
        double actualCapacity,
        LocalDateTime calendarWeek,
        double demand,
        int materialDemandOrder
    ) {
        this.maximumCapacity = maximumCapacity;
        this.actualCapacity = actualCapacity;
        this.calendarWeek = calendarWeek;
        this.demand = demand;
        this.materialDemandOrder = materialDemandOrder;
    }

    public double getMaximumCapacity() {
        return maximumCapacity;
    }

    public void setMaximumCapacity(double maximumCapacity) {
        this.maximumCapacity = maximumCapacity;
    }

    public double getActualCapacity() {
        return actualCapacity;
    }

    public int getMaterialDemandOrder() {
        return materialDemandOrder;
    }

    public void setActualCapacity(double actualCapacity) {
        this.actualCapacity = actualCapacity;
    }

    public LocalDateTime getCalendarWeek() {
        return calendarWeek;
    }

    public void setCalendarWeek(LocalDateTime calendarWeek) {
        this.calendarWeek = calendarWeek;
    }

    public double getDemand() {
        return demand;
    }

    public void setDemand(double demand) {
        this.demand = demand;
    }

    public void setMaterialDemandOrder(int materialDemandOrder) {
        this.materialDemandOrder = materialDemandOrder;
    }

    @Override
    public String toString() {
        return (
            "MaterialCapacityQuantity{" +
            "maximumCapacity=" +
            maximumCapacity +
            ", actualCapacity=" +
            actualCapacity +
            ", calendarWeek=" +
            calendarWeek +
            ", demand=" +
            demand +
            '}'
        );
    }
}
