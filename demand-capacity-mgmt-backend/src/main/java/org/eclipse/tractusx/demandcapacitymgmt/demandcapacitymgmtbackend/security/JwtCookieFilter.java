package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.http.HttpMethod;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtCookieFilter extends OncePerRequestFilter {

    private static final String TOKEN = "auth_token";

    private final Set<String> skipUrls = Set.of("/token/login", "/token/refresh", "/token/logout", "/token/introspect");

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        String method = request.getMethod();

        return HttpMethod.POST.matches(method) && skipUrls.contains(path);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        String token = getTokenFromCookie(request);
        if (token != null) {
            MutableHttpServletRequest mutableRequest = new MutableHttpServletRequest(request);
            mutableRequest.addHeader("Authorization", "Bearer " + token);
            filterChain.doFilter(mutableRequest, response);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equalsIgnoreCase(TOKEN)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
