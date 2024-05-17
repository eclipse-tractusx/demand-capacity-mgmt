package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.config.openapi;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {


	@ExceptionHandler(Exception.class)
	ProblemDetail handleException(Exception e) {
		log.error("Error ", e);
		String errorMsg = ExceptionUtils.getMessage(e);
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, errorMsg);
		problemDetail.setTitle(errorMsg);
		problemDetail.setProperty(System.currentTimeMillis()+"", System.currentTimeMillis());
		return problemDetail;
	}

}
