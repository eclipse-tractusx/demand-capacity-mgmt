package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Objects;
import org.slf4j.Logger;

public class CookieUtil {

    private static User currentLoggedInUser;

    public static String getCookieUserID(HttpServletRequest request) {
        try {
            DecodedJWT decodedJWT = JWT.decode(Objects.requireNonNull(getTokenFromHeader(request)));
            return decodedJWT.getSubject();
        } catch (Exception e) {
            return "empty token? maybe user is not logged in yet";
        }
    }

    public static String getUserName() {
        return currentLoggedInUser.getUsername();
    }

    public static User getUser() {
        return currentLoggedInUser;
    }

    public static void setUser(User user) {
        currentLoggedInUser = user;
    }

    private static String getTokenFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
