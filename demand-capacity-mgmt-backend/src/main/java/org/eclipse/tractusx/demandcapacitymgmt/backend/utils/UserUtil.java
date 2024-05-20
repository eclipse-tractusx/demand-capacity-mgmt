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
package org.eclipse.tractusx.demandcapacitymgmt.backend.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.uuid.Logger;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.eclipse.tractusx.demandcapacitymgmt.backend.entities.enums.Role;

public class UserUtil {

    public static String getUserID(HttpServletRequest request) {
        try {
            DecodedJWT decodedJWT = JWT.decode(Objects.requireNonNull(getTokenFromHeader(request)));
            return decodedJWT.getSubject();
        } catch (Exception e) {
            return "empty token? maybe user is not logged in yet";
        }
    }

    private static String getTokenFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    public static Role getUserRole(HttpServletRequest request) {
        try {
            DecodedJWT decodedJWT = JWT.decode(Objects.requireNonNull(getTokenFromHeader(request)));
            Claim rolesClaim = decodedJWT.getClaim("realm_access");
            Map<String, Object> realmAccessMap = Optional.ofNullable(rolesClaim)
                .map(Claim::asMap)
                .orElse(Collections.emptyMap());

            Object rolesObject = realmAccessMap.get("roles");

            if (rolesObject instanceof List<?>) {
                List<?> list = (List<?>) rolesObject;
                for (Object roleObj : list) {
                    if (roleObj instanceof String) {
                        String roleStr = (String) roleObj;
                        try {
                            return Role.valueOf(roleStr);
                        } catch (IllegalArgumentException e) {
                            Logger.logError(
                                "Incompatible role! User must have one of the 3 role types 'ADMIN','CUSTOMER','SUPPLIER'"
                            );
                        }
                    }
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }
}
