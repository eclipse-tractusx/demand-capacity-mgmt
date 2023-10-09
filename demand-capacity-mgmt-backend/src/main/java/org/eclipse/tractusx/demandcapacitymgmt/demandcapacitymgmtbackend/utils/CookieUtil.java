package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Objects;
import org.slf4j.Logger;

public class CookieUtil {

    public static String getCookieUserID(HttpServletRequest request) {
        try {
            DecodedJWT decodedJWT = JWT.decode(Objects.requireNonNull(getTokenFromHeader(request)));
            return decodedJWT.getSubject();
        } catch (Exception e) {
            return "empty token? maybe user is not logged in yet";
        }
    }

    private static String getTokenFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
