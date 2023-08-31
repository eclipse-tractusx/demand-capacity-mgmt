package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.base;

import java.util.List;

public interface ExceptionResponse {
    int getCode();
    String getMessage();
    List<String> getDetails();
}
