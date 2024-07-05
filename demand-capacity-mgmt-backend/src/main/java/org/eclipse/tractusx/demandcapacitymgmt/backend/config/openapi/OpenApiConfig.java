/*
 * ******************************************************************************
 * Copyright (c) 2024 Contributors to the Eclipse Foundation
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

package org.eclipse.tractusx.demandcapacitymgmt.backend.config.openapi;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.appinfo.InfoConfiguration;
import org.eclipse.tractusx.demandcapacitymgmt.backend.security.AppSecurityConfigProperties;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
@AllArgsConstructor
public class OpenApiConfig {

    private final AppSecurityConfigProperties properties;
    private final InfoConfiguration appInfoConfiguration;

    @Bean
    public OpenAPI customOpenAPI() {
        Info info = new Info();
        info.setTitle(appInfoConfiguration.name());
        info.setDescription(appInfoConfiguration.description());
        info.setVersion(appInfoConfiguration.version());
        OpenAPI openAPI = new OpenAPI();
        if (properties.enabled()) {
            openAPI = enableSecurity(openAPI);
        }
        return openAPI.info(info);
    }

    @Bean
    public GroupedOpenApi openApiDefinition() {
        return GroupedOpenApi.builder().group("docs").pathsToMatch("/**").displayName("Docs").build();
    }

    private OpenAPI enableSecurity(OpenAPI openAPI) {
        Components components = new Components();

        //Auth using access_token
        String accessTokenAuth = "Authenticate using access_token";
        components.addSecuritySchemes(
            accessTokenAuth,
            new SecurityScheme()
                .name(accessTokenAuth)
                .description("Authenticate using token")
                .type(SecurityScheme.Type.HTTP)
                .scheme("Bearer")
        );

        //Auth using Resource Owner Password Flow
        String passwordFlow = "Authenticate using Resource Owner Password Flow";
        components.addSecuritySchemes(
            passwordFlow,
            new SecurityScheme()
                .name(passwordFlow)
                .description(
                    "Authenticate using Resource Owner Password Flow. provide username and password to authenticate"
                )
                .type(SecurityScheme.Type.OAUTH2)
                .flows(
                    new OAuthFlows()
                        .password(
                            new OAuthFlow().tokenUrl(properties.tokenUrl()).refreshUrl(properties.refreshTokenUrl())
                        )
                )
        );

        return openAPI
            .components(components)
            .addSecurityItem(
                new SecurityRequirement()
                    .addList(accessTokenAuth, Collections.emptyList())
                    .addList(passwordFlow, Collections.emptyList())
            );
    }
}
