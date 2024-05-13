package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.security")
public record AppSecurityConfigProperties(
    Boolean enabled,
    String realm,
    String authServerUrl,
    String authUrl,
    String tokenUrl,
    String refreshTokenUrl
) {}
