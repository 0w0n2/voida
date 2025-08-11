package com.bbusyeo.voida.global.exception;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.INTERNAL_SERVER_ERROR;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.INVALID_INPUT_VALUE;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.bbusyeo.voida.global.response.BaseResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    protected BaseResponse<Void> baseError(BaseException e) {
        log.error("BaseException -> {} ({})", e.getStatus(), e.getStatus().getMessage(), e);

        return new BaseResponse<>(e.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected BaseResponse<Void> handleValidException(MethodArgumentNotValidException e) {
        String message = e.getFieldErrors().get(0).getDefaultMessage();
        log.error("MethodArgumentNotValidException -> {}", message);

        return new BaseResponse<>(INVALID_INPUT_VALUE, message);
    }

    @ExceptionHandler(RuntimeException.class)
    protected BaseResponse<Void> runtimeError(RuntimeException e) {
        log.error("RuntimeException -> {}", e.getMessage(), e);

        return new BaseResponse<>(INTERNAL_SERVER_ERROR, e.getMessage());
    }

}
