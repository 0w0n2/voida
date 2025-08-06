package com.bbusyeo.voida.global.security.handler.oauth2;

import com.bbusyeo.voida.api.auth.service.SocialSignUpService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.security.dto.GuestOAuth2UserDto;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 최초 OAuth 로그인일 경우 (GuestOAuth2UserDto) -> 일반 회원가입 진행
 */
@Component
@RequiredArgsConstructor
public class GuestOAuth2UserDtoSuccessHandlerStrategy implements OAuth2SuccessHandlerStrategy {

    private final SocialSignUpService socialSignUpService;

    @Override
    public boolean supports(Object principal) {
        return principal instanceof GuestOAuth2UserDto;
    }

    @Override
    public BaseResponse<?> handle(Authentication authentication, HttpServletResponse response) throws IOException {
        GuestOAuth2UserDto guestOAuth2UserDto = (GuestOAuth2UserDto) authentication.getPrincipal();
        return new BaseResponse<>(socialSignUpService.initialSocialSignUp(guestOAuth2UserDto.getOAuth2UserInfo()));
    }
}
