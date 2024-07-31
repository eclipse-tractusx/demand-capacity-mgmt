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

package org.eclipse.tractusx.demandcapacitymgm.backend.exceptions.type;

import org.eclipse.tractusx.demandcapacitymgm.backend.exceptions.base.CustomException;

public class NotFoundException extends RuntimeException implements CustomException {

    private final String code;
    private final String lastDigits;

    public NotFoundException(String code, String lastDigits) {
        this.code = code;
        this.lastDigits = lastDigits;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String lastDigits() {
        return lastDigits;
    }
}
