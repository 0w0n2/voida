package com.bbusyeo.voida.global.security.handler;

import com.bbusyeo.voida.api.auth.service.SocialSignUpService;
import com.bbusyeo.voida.api.auth.service.TokenAuthService;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.GuestOAuth2UserDto;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
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

    private final SocialSignUpService socialSignUpService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        Object principal = authentication.getPrincipal();
        BaseResponse<?> result;

        if (principal instanceof UserDetailsDto) { // 기존 소셜 로그인 -> 서버 JWT 발급 후 응답
            result = new BaseResponse<>(
                    tokenAuthService.issueJwtAndReturnDto((UserDetailsDto) principal, response));
        } else if (principal instanceof GuestOAuth2UserDto) { // 최초 소셜 로그인 -> 추가 일반 회원가입 필요
            result = new BaseResponse<>(
                    socialSignUpService.initialSocialSignUp(((GuestOAuth2UserDto) principal).getOAuth2UserInfo()), BaseResponseStatus.SOCIAL_NEED_SIGNUP);
        } else {
            throw new BaseException(BaseResponseStatus.INTERNAL_SERVER_ERROR);
        }

        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        String jsonResponse = objectMapper.writeValueAsString(result);
        response.getWriter().write(jsonResponse);
    }

}
