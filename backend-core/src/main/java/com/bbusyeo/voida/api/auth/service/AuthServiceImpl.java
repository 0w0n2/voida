package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.SignInRequestDto;
import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
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

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final TokenUtils tokenUtils;
    private final CookieUtils cookieUtils;

    private final RedisDao redisDao;
    private final TokenBlackListService tokenBlackListService;
    private final AuthenticationProvider authenticationProvider;
    private final JwtTokenService jwtTokenService;

    private static final String SIGNUP_CODE_PREFIX = "signup-code:";

    @Value("${jwt.expire-time.refresh}")
    private Duration refreshExpMin;

    @Value("${voida.mail.expire-time.signup}")
    private Duration signUpMailCodeExpMin;


    @Override
    public SignInResponseDto signIn(SignInRequestDto signInRequestDto, HttpServletResponse response) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(signInRequestDto.getEmail(), signInRequestDto.getPassword());

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

    @Override
    public void refreshAccessToken(String refreshToken, HttpServletResponse response) {
        JwtToken newTokens = jwtTokenService.reissue(refreshToken);

        // 이전에 사용하던 토큰들을 블랙리스트에 저장
        tokenBlackListService.addBlacklistRefresh(refreshToken);

        response.setHeader("Authorization", "Bearer " + newTokens.getAccessToken());
        cookieUtils.setRefreshCookie(response, newTokens.getRefreshToken(), (int) refreshExpMin.getSeconds());
    }


    @Override
    public void signOut(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = tokenUtils.getTokenFromRequest(request);

        String memberUuid = tokenUtils.getSubjectFromToken(accessToken); // AccessToken 에서 username 파싱(email)
        jwtTokenService.deleteRefreshToken(memberUuid); // Redis 에 저장된 refresh Token 삭제

        tokenBlackListService.addBlacklistAccess(accessToken); // AccessToken 을 Redis 에 블랙리스트로 저장

        cookieUtils.setRefreshCookie(response, "", 0); // Refresh Token 쿠키 만료 처리
    }

    @Override
    public VerificationCode generateVerificationCode(String email) {
        String code = UUID.randomUUID().toString().substring(0, 6);

        String key = SIGNUP_CODE_PREFIX + email;
        redisDao.setValue(key, code, signUpMailCodeExpMin); // value: signup-code:email, key: code(UUID)

        String expiredAt = LocalDateTime.now().plus(signUpMailCodeExpMin)
                .format(DateTimeFormatter.ISO_DATE_TIME);

        return VerificationCode.builder()
                .code(code)
                .expiredAt(expiredAt).build();
    }
}
