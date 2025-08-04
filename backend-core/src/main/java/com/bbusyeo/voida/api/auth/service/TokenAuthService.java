package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.auth.dto.SignInRequestDto;
import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.service.JwtTokenService;
import com.bbusyeo.voida.global.security.service.TokenBlackListService;
import com.bbusyeo.voida.global.security.util.CookieUtils;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@Transactional
@RequiredArgsConstructor
public class TokenAuthService {

    private final AuthenticationProvider authenticationProvider;
    private final JwtTokenService jwtTokenService;
    private final TokenBlackListService tokenBlackListService;

    private final CookieUtils cookieUtils;
    private final TokenUtils tokenUtils;

    @Value("${jwt.expire-time.refresh}")
    private Duration refreshExpMin;

    public SignInResponseDto signIn(SignInRequestDto requestDto, HttpServletResponse response) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(requestDto.getEmail(), requestDto.getPassword());

        // 인증 정보 기반으로 JWT token 생성
        Authentication authentication = authenticationProvider.authenticate(authenticationToken);
        UserDetailsDto userDetails = (UserDetailsDto) authentication.getPrincipal();
        JwtToken jwtToken = jwtTokenService.generateToken(userDetails);

        // Access Token -> Header
        response.addHeader("Authorization", "Bearer " + jwtToken.getAccessToken());
        // Refresh Token -> Cookie
        cookieUtils.setRefreshCookie(response, jwtToken.getRefreshToken(), (int) refreshExpMin.getSeconds());

        // member 정보 모두 조회
        Member member = userDetails.getMember();

        return SignInResponseDto.toDto(member);
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
