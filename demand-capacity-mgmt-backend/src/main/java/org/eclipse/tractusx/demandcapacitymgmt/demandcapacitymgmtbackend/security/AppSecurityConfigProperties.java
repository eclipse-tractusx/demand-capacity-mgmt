package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.openapi.security")
public record AppSecurityConfigProperties(
    Boolean enabled,
    String authUrl,
    String tokenUrl,
    String refreshTokenUrl
) {}
