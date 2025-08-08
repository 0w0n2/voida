package com.bbusyeo.voida.global.security.handler;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.util.ResponseWriter;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler { ;

    @Value("${security.oauth.client-endpoint-fail}")
    private String redirectUri;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        int code = (exception.getCause() instanceof BaseException baseException) ?
                baseException.getStatus().getCode() :
                BaseResponseStatus.INTERNAL_SERVER_ERROR.getCode();

        response.sendRedirect(UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("code", code)
                .build().toString()
        );
    }

}
