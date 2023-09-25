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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.KeycloakApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.IntrospectTokenResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.User;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.SecurityTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class SecurityTokenController implements KeycloakApi {

    private final SecurityTokenService securityTokenService;
    private HttpServletRequest request;

    @Override
    public ResponseEntity<IntrospectTokenResponse> introspectToken(String authToken) {
        return ResponseEntity.ok(securityTokenService.introspectToken(request));
    }

    @Override
    public ResponseEntity<User> loginToken(String username, String password) {
        return securityTokenService.generateUserResponseEntity(username, password, request);
    }

    @Override
    public ResponseEntity<Void> logoutToken() {
        return securityTokenService.generateLogoutResponseEntity(request);
    }

    @Override
    public ResponseEntity<User> refreshToken(String refreshToken) {
        return securityTokenService.generateUserRefreshedResponseEntity(refreshToken, request);
    }
}
