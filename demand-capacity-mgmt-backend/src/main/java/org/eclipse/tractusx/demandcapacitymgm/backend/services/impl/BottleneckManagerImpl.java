/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023, 2024 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * *******************************************************************************
 */

package org.eclipse.tractusx.demandcapacitymgm.backend.services.impl;

import eclipse.tractusx.demandcapacitymgm.specification.model.YearReportResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgm.backend.services.BottleneckManager;
import org.eclipse.tractusx.demandcapacitymgm.backend.utils.BottleneckDetectorUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@RequiredArgsConstructor
@Service
@Slf4j
public class BottleneckManagerImpl implements BottleneckManager {

    private final BottleneckDetectorUtil bottleneckDetectorUtil;

    @Override
    public void calculateTodos(String userID) {
        bottleneckDetectorUtil.calculateTodos(userID);
    }

    @Override
    public YearReportResponse generateYearReport(
        String userID,
        String capacityGroupID,
        LocalDate startDate,
        LocalDate endDate,
        boolean ruled,
        int percentage
    ) {
        return bottleneckDetectorUtil.generateYearReport(
            userID,
            capacityGroupID,
            startDate,
            endDate,
            ruled,
            percentage
        );
    }

    @Override
    public void calculateBottleneck(String userID, boolean postLog) {
        bottleneckDetectorUtil.calculateBottleneck(userID, postLog);
    }
}
