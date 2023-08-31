package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.base;

import java.util.List;

public interface CustomException<T extends Exception> {
    int getCode();
    String getMessage();
    List<String> getDetails();
}
