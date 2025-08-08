package com.bbusyeo.voida.global.security.handler.oauth2;

import com.bbusyeo.voida.api.auth.dto.NeedSignupResponseDto;
import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.api.auth.service.SocialSignUpService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.security.dto.GuestOAuth2UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * 최초 OAuth 로그인일 경우 (GuestOAuth2UserDto) -> 일반 회원가입 진행
 */
@Component
@RequiredArgsConstructor
public class GuestOAuth2UserDtoSuccessHandlerStrategy implements OAuth2SuccessHandlerStrategy {

    private final SocialSignUpService socialSignUpService;

    @Value("${security.oauth.client-endpoint}")
    private String redirectUri;

    @Override
    public boolean supports(Object principal) {
        return principal instanceof GuestOAuth2UserDto;
    }

    @Override
    public void handle(Authentication authentication, HttpServletRequest request, HttpServletResponse response) throws IOException {
        GuestOAuth2UserDto guestOAuth2UserDto = (GuestOAuth2UserDto) authentication.getPrincipal();
        NeedSignupResponseDto needSignupResponseDto = socialSignUpService.initialSocialSignUp(guestOAuth2UserDto.getOAuth2UserInfo());

        // 지정 리다이렉트 경로로 게스트 정보를 쿼리 파라미터에 담아 리턴
        response.sendRedirect(UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("isFirstLogin", needSignupResponseDto.getIsFirstLogin())
                .queryParam("email", needSignupResponseDto.getEmail())
                .queryParam("providerName", needSignupResponseDto.getProviderName())
                .build().toString()
        );
    }
}
