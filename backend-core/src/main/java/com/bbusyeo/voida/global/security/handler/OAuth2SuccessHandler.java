package com.bbusyeo.voida.global.security.handler;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.handler.oauth2.OAuth2SuccessHandlerStrategy;
import com.bbusyeo.voida.global.security.util.ResponseWriter;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

/**
 * OAuth2 로그인 후 흐름 제어
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;
    private final List<OAuth2SuccessHandlerStrategy> strategies;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        Object principal = authentication.getPrincipal();
        BaseResponse<?> result = null;

        for (OAuth2SuccessHandlerStrategy strategy : strategies) {
            if (strategy.supports(principal)) {
                result = strategy.handle(authentication, response);
                break;
            }
        }

        if (result == null) {
            throw new BaseException(BaseResponseStatus.INTERNAL_SERVER_ERROR);
        }

        ResponseWriter.writeResponse(response, objectMapper, result);
    }

}
