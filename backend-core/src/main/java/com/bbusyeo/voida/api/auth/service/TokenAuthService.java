package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.service.JwtTokenService;
import com.bbusyeo.voida.global.security.service.TokenBlackListService;
import com.bbusyeo.voida.global.security.util.CookieUtils;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@Transactional
@RequiredArgsConstructor
public class TokenAuthService {

    private final JwtTokenService jwtTokenService;
    private final TokenBlackListService tokenBlackListService;

    private final CookieUtils cookieUtils;
    private final TokenUtils tokenUtils;

    @Value("${jwt.expire-time.refresh}")
    private Duration refreshExpMin;

    // 인증된 사용자 정보 기반으로 JWT를 발급하고, 응답 헤더/쿠키에 담아 DTO를 반환
    public SignInResponseDto issueJwtAndReturnDto(UserDetailsDto userDetails, HttpServletResponse response) {
        JwtToken jwtToken = jwtTokenService.generateToken(userDetails);
        // Access Token -> Header
        response.addHeader("Authorization", "Bearer " + jwtToken.getAccessToken());
        // Refresh Token -> Cookie
        cookieUtils.setRefreshCookie(response, jwtToken.getRefreshToken(), (int) refreshExpMin.getSeconds());

        return SignInResponseDto.toDto(userDetails.getMember());
    }

    public void refreshAccessToken(String refreshToken, HttpServletResponse response) {
        JwtToken newTokens = jwtTokenService.reissue(refreshToken);

        // 이전에 사용하던 토큰들을 블랙리스트에 저장
        tokenBlackListService.addBlacklistRefresh(refreshToken);

        response.setHeader("Authorization", "Bearer " + newTokens.getAccessToken());
        cookieUtils.setRefreshCookie(response, newTokens.getRefreshToken(), (int) refreshExpMin.getSeconds());
    }

    public void signOut(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = tokenUtils.getTokenFromRequest(request);

        String memberUuid = tokenUtils.getSubjectFromToken(accessToken); // AccessToken 에서 username 파싱(email)
        jwtTokenService.deleteRefreshToken(memberUuid); // Redis 에 저장된 refresh Token 삭제

        tokenBlackListService.addBlacklistAccess(accessToken); // AccessToken 을 Redis 에 블랙리스트로 저장

        cookieUtils.setRefreshCookie(response, "", 0); // Refresh Token 쿠키 만료 처리
    }
}
