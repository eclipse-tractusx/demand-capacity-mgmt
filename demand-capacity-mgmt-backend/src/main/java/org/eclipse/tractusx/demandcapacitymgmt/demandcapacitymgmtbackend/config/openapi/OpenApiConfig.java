package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.config.openapi;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import java.util.Collections;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.appinfo.InfoConfiguration;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.security.AppSecurityConfigProperties;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
        String publicClientAuth = "Authenticate using username and password";
        Components components = new Components();
        components.addSecuritySchemes(
            publicClientAuth,
            new SecurityScheme()
                .name(publicClientAuth)
                .description(
                    "Authenticate using username and password. before using this make sure we configured public client in keycloak with valid redirect url and web origin"
                )
                .type(SecurityScheme.Type.OAUTH2)
                .flows(
                    new OAuthFlows()
                        .authorizationCode(
                            new OAuthFlow()
                                .authorizationUrl(properties.authUrl())
                                .tokenUrl(properties.tokenUrl())
                                .refreshUrl(properties.refreshTokenUrl())
                        )
                )
        );

        //with client_is and client_secret
        String name = "Authenticate using client_id and client_secret";
        components.addSecuritySchemes(
            name,
            new SecurityScheme()
                .name(name)
                .description(
                    "Authenticate using private keycloak client_id and client_secret. before using this we need to add Web origins for client in keycloak"
                )
                .type(SecurityScheme.Type.OAUTH2)
                .flows(
                    new OAuthFlows()
                        .clientCredentials(
                            new OAuthFlow().tokenUrl(properties.tokenUrl()).authorizationUrl(properties.authUrl())
                        )
                )
        );

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
        return openAPI
            .components(components)
            .addSecurityItem(
                new SecurityRequirement()
                    .addList(accessTokenAuth, Collections.emptyList())
                    .addList(name, Collections.emptyList())
                    .addList(publicClientAuth, Collections.emptyList())
            );
    }
}
