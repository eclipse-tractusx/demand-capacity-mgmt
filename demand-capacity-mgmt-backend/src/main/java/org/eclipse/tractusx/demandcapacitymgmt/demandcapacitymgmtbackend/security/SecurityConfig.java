package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(
            authorize ->
                authorize
                    .requestMatchers(HttpMethod.POST, "/token/login", "/token/refresh", "/token/logout", "/token/introspect")
                    .permitAll()
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated()
        );
        http.oauth2ResourceServer(t -> t.jwt(Customizer.withDefaults()));
        http.sessionManagement(t -> t.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
}
