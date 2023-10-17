package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.User;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Objects;

public class UserUtil {

    public static String getUserID(HttpServletRequest request) {
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
