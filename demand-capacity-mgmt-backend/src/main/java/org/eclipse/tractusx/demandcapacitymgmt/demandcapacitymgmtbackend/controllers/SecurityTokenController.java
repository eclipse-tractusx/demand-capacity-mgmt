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
import eclipse.tractusx.demand_capacity_mgmt_specification.model.TokenResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.SecurityTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@SecurityRequirement(name = "Keycloak")
public class SecurityTokenController implements KeycloakApi {

    private final SecurityTokenService securityTokenService;
    private HttpServletRequest request;
    private static final String TOKEN = "auth_token";

    @Override
    public ResponseEntity<IntrospectTokenResponse> introspectToken(String authToken) {
        return ResponseEntity.ok(securityTokenService.introspectToken(request));
    }

    @Override
    public ResponseEntity<TokenResponse> loginToken(String username, String password) {
        try {
            TokenResponse tokenResponse = securityTokenService.loginToken(username, password);
            return new ResponseEntity<>(tokenResponse, setHeaders(tokenResponse), HttpStatus.OK);
        } catch (Exception e) {
            // Handle any exceptions that might occur during logout
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> logoutToken(String refreshToken) {
        try {
            securityTokenService.logoutToken(refreshToken);
            Cookie authCookie = new Cookie(TOKEN, null);
            authCookie.setMaxAge(0);
            authCookie.setHttpOnly(true);
            authCookie.setSecure(true);
            authCookie.setPath("/");

            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.add("Set-Cookie", TOKEN + authCookie.getValue());
            return new ResponseEntity<>(responseHeaders, HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            // Handle any exceptions that might occur during logout
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<TokenResponse> refreshToken(String refreshToken) {
        try {
            TokenResponse tokenResponse = securityTokenService.refreshToken(refreshToken);
            return new ResponseEntity<>(tokenResponse, setHeaders(tokenResponse), HttpStatus.OK);
        } catch (Exception e) {
            // Handle any exceptions that might occur during refreshing
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private HttpHeaders setHeaders(TokenResponse tokenResponse) {
        Cookie authCookie = new Cookie(TOKEN, tokenResponse.getAccessToken());
        authCookie.setMaxAge(tokenResponse.getExpiresIn());
        authCookie.setHttpOnly(true);
        authCookie.setSecure(true);
        authCookie.setPath("/");

        StringBuilder cookieValue = new StringBuilder();
        cookieValue.append(TOKEN).append("=").append(authCookie.getValue()).append(";");
        cookieValue.append(" Max-Age=").append(authCookie.getMaxAge()).append(";");
        cookieValue.append(" HttpOnly;");
        if (authCookie.getSecure()) {
            cookieValue.append(" Secure;");
        }
        cookieValue.append(" Path=").append(authCookie.getPath()).append(";");

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add("Set-Cookie", cookieValue.toString());
        return responseHeaders;
    }
}
