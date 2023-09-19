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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.IntrospectTokenResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.TokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.SecurityTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@Service
@Slf4j
public class SecurityTokenServiceImpl implements SecurityTokenService {

    private final WebClient keycloakWebClient;

    @Value("${keycloak.baseUrl}")
    private String keycloakBaseUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.clientId}")
    private String clientId;

    @Value("${keycloak.clientSecret}")
    private String clientSecret;

    @Value("${keycloak.grant_type_token}")
    private String grantType_password;

    @Value("${keycloak.grant_type_refresh_token}")
    private String grantType_refresh_token;

    private static final String CLIENT_ID = "client_id";
    private static final String CLIENT_SECRET = "client_secret";
    private static final String REFRESH_TOKEN = "refresh_token";
    private static final String GRANT_TYPE = "grant_type";
    private static final String USERNAME = "username";
    private static final String PASSWORD = "password";

    @Override
    public void logoutToken(String refreshToken) {
        String logoutUrl = String.format("%s/auth/realms/%s/protocol/openid-connect/logout", keycloakBaseUrl, realm);

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add(CLIENT_ID, clientId);
        formData.add(CLIENT_SECRET, clientSecret);
        formData.add(REFRESH_TOKEN, refreshToken);

        keycloakWebClient
            .post()
            .uri(logoutUrl)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .bodyValue(formData)
            .retrieve()
            .onStatus(
                HttpStatusCode::is4xxClientError,
                response -> Mono.error(new RuntimeException("4xx error calling Keycloak"))
            )
            .onStatus(
                HttpStatusCode::is5xxServerError,
                response -> Mono.error(new RuntimeException("5xx error calling Keycloak"))
            )
            .bodyToMono(Void.class)
            .block();
    }

    @Override
    public TokenResponse loginToken(String username, String password) {
        String tokenUrl = String.format("%s/auth/realms/%s/protocol/openid-connect/token", keycloakBaseUrl, realm);

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add(CLIENT_ID, clientId);
        formData.add(CLIENT_SECRET, clientSecret);
        formData.add(GRANT_TYPE, grantType_password);
        formData.add(USERNAME, username);
        formData.add(PASSWORD, password);

        return keycloakWebClient
            .post()
            .uri(tokenUrl)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .bodyValue(formData)
            .retrieve()
            .onStatus(
                HttpStatusCode::is4xxClientError,
                response -> Mono.error(new RuntimeException("4xx error calling Keycloak"))
            )
            .onStatus(
                HttpStatusCode::is5xxServerError,
                response -> Mono.error(new RuntimeException("5xx error calling Keycloak"))
            )
            .bodyToMono(TokenResponse.class)
            .block();
    }

    @Override
    public TokenResponse refreshToken(String refreshToken_) {
        String tokenUrl = String.format("%s/auth/realms/%s/protocol/openid-connect/token", keycloakBaseUrl, realm);

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add(CLIENT_ID, clientId);
        formData.add(CLIENT_SECRET, clientSecret);
        formData.add(GRANT_TYPE, grantType_refresh_token);
        formData.add(REFRESH_TOKEN, refreshToken_);

        return keycloakWebClient
            .post()
            .uri(tokenUrl)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .bodyValue(formData)
            .retrieve()
            .onStatus(
                HttpStatusCode::is4xxClientError,
                response -> Mono.error(new RuntimeException("4xx error calling Keycloak"))
            )
            .onStatus(
                HttpStatusCode::is5xxServerError,
                response -> Mono.error(new RuntimeException("5xx error calling Keycloak"))
            )
            .bodyToMono(TokenResponse.class)
            .block();
    }

    @Override
    public IntrospectTokenResponse introspectToken(String token) {
        String introspectUrl = String.format(
            "%s/auth/realms/%s/protocol/openid-connect/token/introspect",
            keycloakBaseUrl,
            realm
        );

        return keycloakWebClient
            .post()
            .uri(introspectUrl)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .bodyValue("client_id=" + clientId + "&client_secret=" + clientSecret + "&token=" + token)
            .retrieve()
            .onStatus(
                HttpStatusCode::is4xxClientError,
                response -> Mono.error(new RuntimeException("4xx error calling Keycloak"))
            )
            .onStatus(
                HttpStatusCode::is5xxServerError,
                response -> Mono.error(new RuntimeException("5xx error calling Keycloak"))
            )
            .bodyToMono(IntrospectTokenResponse.class)
            .block();
    }
}
