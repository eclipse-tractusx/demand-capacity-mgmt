/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
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

package org.eclipse.tractusx.demandcapacitymgmt.backend.controllers;

import eclipse.tractusx.demandcapacitymgmt.specification.api.YearReportApi;
import eclipse.tractusx.demandcapacitymgmt.specification.model.YearReportRequest;
import eclipse.tractusx.demandcapacitymgmt.specification.model.YearReportResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.impl.BottleneckManagerImpl;
import org.eclipse.tractusx.demandcapacitymgmt.backend.utils.UserUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class YearReportController implements YearReportApi {

    private HttpServletRequest request;

    private BottleneckManagerImpl bottleneckManager;

    @Override
    public ResponseEntity<YearReportResponse> generateYearReport(YearReportRequest yearReportRequest) throws Exception {
        return ResponseEntity.status(200).body(
            bottleneckManager.generateYearReport(
                UserUtil.getUserID(request),
                yearReportRequest.getCgID(),
                yearReportRequest.getStartDate(),
                yearReportRequest.getEndDate(),
                yearReportRequest.getRuled(),
                yearReportRequest.getPercentage()
            )
        );
    }
}
