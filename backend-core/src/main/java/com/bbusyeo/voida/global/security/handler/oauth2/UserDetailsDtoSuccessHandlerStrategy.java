package com.bbusyeo.voida.global.security.handler.oauth2;

import com.bbusyeo.voida.api.auth.service.TokenAuthService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 기존 소셜 계정이 있을 경우 -> 서버 자체 JWT 토큰 발행 후 로그인 성공
 */
@Component
@RequiredArgsConstructor
public class UserDetailsDtoSuccessHandlerStrategy implements OAuth2SuccessHandlerStrategy {

    private final TokenAuthService tokenAuthService;

    @Override
    public boolean supports(Object principal) {
        return principal instanceof UserDetailsDto;
    }

    @Override
    public BaseResponse<?> handle(Authentication authentication, HttpServletResponse response) throws IOException {
        UserDetailsDto userDetailsDto = (UserDetailsDto) authentication.getPrincipal();
        return new BaseResponse<>(tokenAuthService.issueJwtAndReturnDto(userDetailsDto, response).toSocialSignInResponseDto());
    }
}
