package com.bbusyeo.voida.global.exception;

import com.bbusyeo.voida.global.response.BaseResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.*;

@Slf4j
@Order(1) // GlobalExceptionHandler 보다 먼저 처리(RuntimeException 에 걸리는 문제)
@RestControllerAdvice
public class SecurityExceptionHandler {

    @ExceptionHandler(UsernameNotFoundException.class)
    protected BaseResponse<Void> handleUsernameNotFoundException(UsernameNotFoundException e) {
        log.error("UsernameNotFoundException -> {}", e.getMessage());
        return new BaseResponse<>(MEMBER_NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    protected BaseResponse<Void> handleAuthenticationException(AuthenticationException e) {
        log.error("AuthenticationException -> {}", e.getMessage());
        return new BaseResponse<>(INVALID_CREDENTIALS, e.getMessage());
    }
}