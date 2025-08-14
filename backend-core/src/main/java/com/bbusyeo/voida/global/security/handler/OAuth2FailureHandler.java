package com.bbusyeo.voida.global.security.handler;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
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

    @Value("${security.oauth.client-endpoint}")
    private String redirectUri;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        int code = (exception.getCause() instanceof BaseException baseException) ?
                baseException.getStatus().getCode() :
                BaseResponseStatus.INTERNAL_SERVER_ERROR.getCode();

        String queryParams = UriComponentsBuilder.fromUriString(redirectUri).queryParam("code", code).build().getQuery();
        String targetUrl = redirectUri + "?" + queryParams;
        response.setStatus(HttpServletResponse.SC_FOUND);
        response.setHeader("Location", targetUrl);
    }
}
