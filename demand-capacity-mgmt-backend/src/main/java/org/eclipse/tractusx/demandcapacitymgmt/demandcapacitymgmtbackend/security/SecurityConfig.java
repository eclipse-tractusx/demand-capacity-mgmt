package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.security;

import java.util.Arrays;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("Cache-Control", "Content-Type","x-auth-token","Authorization"));
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000","http://localhost:8080"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setExposedHeaders(List.of("Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> corsConfigurationSource());
        http.csrf(AbstractHttpConfigurer::disable);
        http.sessionManagement(
                sessionMgmt -> sessionMgmt.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
        http.authorizeHttpRequests(
                authorize ->
                        authorize
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/token/login",
                                        "/token/refresh",
                                        "/token/logout",
                                        "/token/introspect"
                                )
                                .permitAll()
                                .anyRequest()
                                .authenticated()
        );
        http.oauth2ResourceServer(t -> t.jwt(Customizer.withDefaults()));
        return http.build();
    }
}
