package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.base;

import java.util.List;
public class ExceptionResponseImpl<T extends CustomException<?>> implements ExceptionResponse {

    private final int code;
    private final String message;
    private final List<String> details;

    public ExceptionResponseImpl(T ex) {
        this.code = ex.getCode();
        this.message = ex.getMessage();
        this.details = ex.getDetails();
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }

    @Override
    public List<String> getDetails() {
        return details;
    }
}
