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

package org.eclipse.tractusx.demandcapacitymgmt.backend.utils;

import java.util.UUID;
import java.util.regex.Pattern;

public class UUIDUtil {

    private static final Pattern UUID_REGEX_PATTERN = Pattern.compile(
        "^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$"
    );

    public static UUID generateUUIDFromString(String id) {
        checkValidUUID(id);
        UUID uuid = UUID.fromString(id);
        return uuid;
    }

    public static boolean checkValidUUID(String id) {
        if (id == null) {
            return false;
        }
        return UUID_REGEX_PATTERN.matcher(id).matches();
    }
}
