package com.bbusyeo.voida.global.security.handler.oauth2;

import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.api.auth.service.TokenAuthService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * 기존 소셜 계정이 있을 경우 -> 서버 자체 JWT 토큰 발행 후 로그인 성공
 */
@Component
@RequiredArgsConstructor
public class UserDetailsDtoSuccessHandlerStrategy implements OAuth2SuccessHandlerStrategy {

    private final TokenAuthService tokenAuthService;

    @Value("${security.oauth.client.redirect-uri}")
    private String redirectUri;

    @Override
    public boolean supports(Object principal) {
        return principal instanceof UserDetailsDto;
    }

    @Override
    public void handle(Authentication authentication, HttpServletRequest request, HttpServletResponse response) throws IOException {
        UserDetailsDto userDetailsDto = (UserDetailsDto) authentication.getPrincipal();
        SignInResponseDto signInResponseDto = tokenAuthService.issueJwtAndReturnDto(userDetailsDto, response);

        // 지정 리다이렉트 경로로 로그인 정보를 쿼리 파라미터에, RefreshToken은 Cookie 에 담아 리턴(리다이렉트라 AccessToken은 응답되지 않음)
        response.sendRedirect(UriComponentsBuilder.fromUriString(redirectUri)
                        .queryParam("isFirstLogin", false)
                        .queryParam("isNewbie", signInResponseDto.getIsNewbie())
                        .build().toString()
        );
    }
}
