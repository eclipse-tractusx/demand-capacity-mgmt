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

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.IntrospectTokenResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.Role;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.TokenResponse;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.UserEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.UserRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.SecurityTokenService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.CookieUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
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

    private final UserRepository userRepository;
    private static final String TOKEN = "auth_token";
    private static final String CLIENT_ID = "client_id";
    private static final String CLIENT_SECRET = "client_secret";
    private static final String REFRESH_TOKEN = "refresh_token";
    private static final String GRANT_TYPE = "grant_type";
    private static final String USERNAME = "username";
    private static final String PASSWORD = "password";
    private static final String COOKIE = "Set-Cookie";

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

    private void logoutToken(HttpServletRequest request) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add(CLIENT_ID, clientId);
        formData.add(CLIENT_SECRET, clientSecret);
        formData.add(REFRESH_TOKEN, getTokenFromCookie(request, true));

        keycloakWebClient
            .post()
            .uri(logoutTokenUrl())
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

    private TokenResponse loginToken(String username, String password) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add(CLIENT_ID, clientId);
        formData.add(CLIENT_SECRET, clientSecret);
        formData.add(GRANT_TYPE, grantType_password);
        formData.add(USERNAME, username);
        formData.add(PASSWORD, password);
        CookieUtil.setUserName(username);

        return keycloakWebClient
            .post()
            .uri(tokenUrl())
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

    private TokenResponse refreshToken(String refreshToken) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add(CLIENT_ID, clientId);
        formData.add(CLIENT_SECRET, clientSecret);
        formData.add(GRANT_TYPE, grantType_refresh_token);
        formData.add(REFRESH_TOKEN, refreshToken);

        return keycloakWebClient
            .post()
            .uri(tokenUrl())
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
    public IntrospectTokenResponse introspectToken(HttpServletRequest request) {
        String token = getTokenFromCookie(request, false);
        return keycloakWebClient
            .post()
            .uri(introspectTokenUrl())
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

    private String getTokenFromCookie(HttpServletRequest request, boolean logout) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (!logout) {
                    if (cookie.getName().equalsIgnoreCase(TOKEN)) {
                        return cookie.getValue();
                    }
                } else {
                    if (cookie.getName().equalsIgnoreCase(REFRESH_TOKEN)) {
                        return cookie.getValue();
                    }
                }
            }
        }
        return null;
    }

    private HttpHeaders setHeaders(TokenResponse tokenResponse) {
        Cookie authCookie = new Cookie(TOKEN, tokenResponse.getAccessToken());
        authCookie.setMaxAge(tokenResponse.getExpiresIn());
        authCookie.setHttpOnly(true);
        authCookie.setSecure(true);
        authCookie.setPath("/");

        Cookie refreshCookie = new Cookie(REFRESH_TOKEN, tokenResponse.getRefreshToken());
        refreshCookie.setMaxAge(500);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add(COOKIE, getCookieString(authCookie));
        responseHeaders.add(COOKIE, getCookieString(refreshCookie));

        return responseHeaders;
    }

    private String getCookieString(Cookie cookie) {
        StringBuilder cookieValue = new StringBuilder();
        cookieValue.append(cookie.getName()).append("=").append(cookie.getValue()).append(";");
        cookieValue.append(" Max-Age=").append(cookie.getMaxAge()).append(";");
        if (cookie.isHttpOnly()) {
            cookieValue.append(" HttpOnly;");
        }
        if (cookie.getSecure()) {
            cookieValue.append(" Secure;");
        }
        cookieValue.append(" Path=").append(cookie.getPath()).append(";");
        return cookieValue.toString();
    }

    @Override
    public ResponseEntity<User> generateUserResponseEntity(
        String username,
        String password,
        HttpServletRequest request
    ) {
        TokenResponse token = loginToken(username, password);
        return new ResponseEntity<>(fetchUser(token), setHeaders(token), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<User> generateUserRefreshedResponseEntity(String token, HttpServletRequest request) {
        TokenResponse refreshToken = refreshToken(token);
        return new ResponseEntity<>(fetchUser(refreshToken), setHeaders(refreshToken), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> generateLogoutResponseEntity(HttpServletRequest request) {
        logoutToken(request);
        // Expire auth_token cookie
        Cookie authCookie = new Cookie(TOKEN, null);
        authCookie.setMaxAge(0);
        authCookie.setHttpOnly(true);
        authCookie.setSecure(true);
        authCookie.setPath("/");

        // Expire refresh_token cookie
        Cookie refreshCookie = new Cookie(REFRESH_TOKEN, null);
        refreshCookie.setMaxAge(0);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add(COOKIE, getCookieString(authCookie));
        responseHeaders.add(COOKIE, getCookieString(refreshCookie));

        return new ResponseEntity<>(responseHeaders, HttpStatus.NO_CONTENT);
    }

    private User fetchUser(TokenResponse token) {
        DecodedJWT decodedJWT = JWT.decode(token.getAccessToken());
        String userID = decodedJWT.getSubject();

        UserEntity entity = userRepository
            .findById(UUID.fromString(userID))
            .orElseGet(
                () -> {
                    UserEntity newUserEntity = generateUser(userID, decodedJWT);
                    userRepository.save(newUserEntity);
                    return newUserEntity;
                }
            );
        return convertUserEntity(entity);
    }

    private UserEntity generateUser(String userID, DecodedJWT decodedJWT) {
        UserEntity newUserEntity = new UserEntity();
        newUserEntity.setId(UUID.fromString(userID));
        newUserEntity.setEmail(Optional.ofNullable(decodedJWT.getClaim("email")).map(Claim::asString).orElse(""));
        newUserEntity.setName(Optional.ofNullable(decodedJWT.getClaim("given_name")).map(Claim::asString).orElse(""));
        newUserEntity.setLastName(
            Optional.ofNullable(decodedJWT.getClaim("family_name")).map(Claim::asString).orElse("")
        );
        newUserEntity.setUsername(
            Optional.ofNullable(decodedJWT.getClaim("preferred_username")).map(Claim::asString).orElse("")
        );

        Claim rolesClaim = decodedJWT.getClaim("realm_access");
        Map<String, Object> realmAccessMap = Optional
            .ofNullable(rolesClaim)
            .map(Claim::asMap)
            .orElse(Collections.emptyMap());

        Object rolesObject = realmAccessMap.get("roles");

        if (rolesObject instanceof List<?>) {
            List<?> list = (List<?>) rolesObject;
            for (Object roleObj : list) {
                if (roleObj instanceof String) {
                    String roleStr = (String) roleObj;
                    try {
                        org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role role = org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role.valueOf(
                            roleStr
                        );
                        newUserEntity.setRole(role);
                        break;
                    } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Illegal Role detected! User must have one of the role types");
                    }
                }
            }
        }
        return newUserEntity;
    }

    private User convertUserEntity(UserEntity userEntity) {
        User user = new User();
        user.setUserID(userEntity.getId().toString());
        user.setEmail(userEntity.getEmail());
        user.setName(userEntity.getName());
        user.setLastName(userEntity.getLastName());
        user.setUsername(userEntity.getUsername());
        user.setRole(Role.valueOf(userEntity.getRole().name()));
        return user;
    }

    private String tokenUrl() {
        return String.format("%s/auth/realms/%s/protocol/openid-connect/token", keycloakBaseUrl, realm);
    }

    private String introspectTokenUrl() {
        return String.format("%s/auth/realms/%s/protocol/openid-connect/token/introspect", keycloakBaseUrl, realm);
    }

    private String logoutTokenUrl() {
        return String.format("%s/auth/realms/%s/protocol/openid-connect/logout", keycloakBaseUrl, realm);
    }
}
