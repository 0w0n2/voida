package com.bbusyeo.voida.global.security.handler;

import com.bbusyeo.voida.api.auth.dto.NeedSignupResponseDto;
import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.api.auth.service.TokenAuthService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.service.JwtTokenService;
import com.bbusyeo.voida.global.security.util.CookieUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * OAuth2 로그인 후 흐름 제어
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;

    private final TokenAuthService tokenAuthService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        UserDetailsDto userDetails = (UserDetailsDto) authentication.getPrincipal();
        BaseResponse<?> baseResponse;

        if (userDetails.isNeedSignUp()) { // 최초 소셜 로그인 -> 추가 일반 회원가입 필요
            baseResponse = new BaseResponse<>(NeedSignupResponseDto.toDto(userDetails.getOAuth2UserInfo()));
        } else { // 기존 소셜 로그인 -> 서버 JWT 발급 후 응답
            baseResponse = new BaseResponse<>(tokenAuthService.issueJwtAndReturnDto(userDetails, response));
        }

        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        String jsonResponse = objectMapper.writeValueAsString(baseResponse);
        response.getWriter().write(jsonResponse);
    }
}
