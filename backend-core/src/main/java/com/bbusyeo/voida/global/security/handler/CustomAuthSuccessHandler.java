package com.bbusyeo.voida.global.security.handler;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.util.CookieUtils;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class CustomAuthSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;
    private final TokenUtils tokenUtils;
    private final CookieUtils cookieUtils;

    @Value("${jwt.expire-time.refresh}")
    private Duration refreshExpMin;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException {
        log.debug("3.1. CustomAuthSuccessHandler");

        // 사용자와 관련된 정보를 모두 조회
        Member member = ((UserDetailsDto) authentication.getPrincipal()).getMember();

        // 응답 데이터 구성 TODO-SECURITY: 나중에 응답 데이터 폼 일치시켜야함
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("isNewbie", member.getIsNewbie());
        responseMap.put("resultCode", 200);
        responseMap.put("failMsg", null);
        
        // JwtToken 생성
        JwtToken jwtToken = tokenUtils.generateToken(authentication);
        String accessToken = jwtToken.getAccessToken();
        String refreshToken = jwtToken.getRefreshToken();
        log.debug("accessToken:{}\nrefreshToken: {}", accessToken, refreshToken);

        // Access Token -> Header
        response.addHeader("Authorization", "Bearer " + accessToken);

        // Refresh Token -> Cookie
        cookieUtils.setRefreshCookie(response, refreshToken, (int) (refreshExpMin.getSeconds()));

        // 응답 JSON 출력
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        PrintWriter printWriter = response.getWriter();
        printWriter.write(objectMapper.writeValueAsString(responseMap));
        printWriter.flush();
        printWriter.close();
    }
}
