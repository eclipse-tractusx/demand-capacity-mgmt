/*
 *  *******************************************************************************
 *  Copyright (c) 2024 Contributors to the Eclipse Foundation
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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    public static final String TIMESTAMP = "timestamp";

    /**
     * This method is an exception handler for all exceptions that are not explicitly handled elsewhere.
     * It catches any exception that occurs in the application and returns a ProblemDetail object.
     *
     * @param e The exception that occurred.
     * @return A ProblemDetail object containing information about the exception.
     */
    @ExceptionHandler(Exception.class)
    ProblemDetail handleException(Exception e) {
        log.error("Error ", e);
        String errorMsg = ExceptionUtils.getMessage(e);
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, errorMsg);
        problemDetail.setTitle(errorMsg);
        problemDetail.setProperty(TIMESTAMP, System.currentTimeMillis());
        return problemDetail;
    }
}
