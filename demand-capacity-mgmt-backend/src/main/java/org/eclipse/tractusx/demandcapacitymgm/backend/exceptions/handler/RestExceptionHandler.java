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

package org.eclipse.tractusx.demandcapacitymgm.backend.exceptions.handler;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgm.backend.exceptions.base.ExceptionResponseImpl;
import org.eclipse.tractusx.demandcapacitymgm.backend.exceptions.type.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgm.backend.exceptions.type.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public final ResponseEntity<Object> handleNotFoundException(NotFoundException ex) {
        return ResponseEntity.ok().body(new ExceptionResponseImpl(ex.getCode(), ex.lastDigits()));
    }

    @ExceptionHandler(BadRequestException.class)
    public final ResponseEntity<Object> handleBadRequestException(BadRequestException ex) {
        return ResponseEntity.ok().body(new ExceptionResponseImpl(ex.getCode(), ex.lastDigits()));
    }

    @ExceptionHandler({ Exception.class })
    public final ResponseEntity<Object> handleAllExceptions(Exception ex) {
        if (ex.getMessage().contains("Keycloak")) {
            return buildCustomResponseEntity500("4", "00");
        } else return ResponseEntity.ok().body(new ExceptionResponseImpl("0", "00"));
    }

    private ResponseEntity<Object> buildCustomResponseEntity500(String code, String lastDigits) {
        ExceptionResponseImpl response = new ExceptionResponseImpl(code, lastDigits);
        return ResponseEntity.status(500).body(response);
    }

    private ResponseEntity<Object> buildCustomResponseEntity(String code, String lastDigits) {
        ExceptionResponseImpl response = new ExceptionResponseImpl(code, lastDigits);
        return ResponseEntity.ok().body(response);
    }
}
