package com.bbusyeo.voida.global.security.handler.oauth2;

import com.bbusyeo.voida.global.response.BaseResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

import java.io.IOException;

/**
 * OAuth2Success 분기 별 처리할 로직 분기
 */
public interface OAuth2SuccessHandlerStrategy {
    boolean supports(Object principal);
    BaseResponse<?> handle(Authentication authentication, HttpServletResponse response) throws IOException;
}
