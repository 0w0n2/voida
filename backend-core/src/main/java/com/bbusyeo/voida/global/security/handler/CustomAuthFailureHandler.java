package com.bbusyeo.voida.global.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
public class CustomAuthFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.debug("3.2. CustomFailureSuccessHandler");

        String failMsg = "";

        if (exception instanceof AuthenticationServiceException ||
                exception instanceof BadCredentialsException ||
                exception instanceof LockedException ||
                exception instanceof DisabledException ||
                exception instanceof AccountExpiredException ||
                exception instanceof CredentialsExpiredException) {
            failMsg = "로그인 정보가 일치하지 않습니다.";
        }

        // 응답값 구성 및 전달
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");

        log.debug(failMsg);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("userInfo", null);
        responseMap.put("resultCode", 9999);
        responseMap.put("failMsg", failMsg);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseMap);

        PrintWriter printWriter = response.getWriter();
        printWriter.print(jsonResponse);
        printWriter.flush();
        printWriter.close();
    }
}
