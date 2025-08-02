package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.EmailCodeResponseDto;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.service.TokenBlackListService;
import com.bbusyeo.voida.global.security.util.CookieUtils;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

    private final String SIGNUP_CODE_PREFIX = "signup-code:";

    @Value("${jwt.expire-time.refresh}")
    private Duration refreshExpMin;

    @Value("${voida.mail.expire-time.signup}")
    private Duration signUpMailCodeExpMin;

    @Override
    public void refreshAccessToken(String refreshToken, HttpServletResponse response) {
        if (tokenUtils.isInvalidToken(refreshToken)) {
            throw new BaseException(BaseResponseStatus.INVALID_JWT_TOKEN);
        }   // 필터 잘 설정해두면 매번 이거 안 해도 될 거 같은데...
        // ㄴ TODO: Refresh API가 필터를 거치지 않도록 `SecurityConfig`에서 `permitAll()`로 열어두었다면,
        //  이 유효성 검사는 반드시 필요합니다. 하지만 필터를 거치도록 설정되어 있다면, 이 코드는
        //  제거하여 중복을 피하는 것이 좋습니다. 현재 코드에서는 permitAll이므로 이 검증은 유지하는
        //  것이 맞습니다.

        String username = tokenUtils.getUserNameFromToken(refreshToken);
        Object redisSavedRefreshToken = redisDao.getValue(username);
        
        // Redis 에 토큰이 존재하는지 확인
        if (redisSavedRefreshToken == null) {
            throw new BaseException(BaseResponseStatus.INVALID_JWT_TOKEN); // 혹은 로그아웃된 사용자라는 별도 상태 코드 필요
        }

        // 저장된 토큰과 일치하는지 확인
        if (!refreshToken.equals(redisSavedRefreshToken.toString())) {  // redis
            throw new BaseException(BaseResponseStatus.INVALID_JWT_TOKEN);
        }

        JwtToken newTokens = tokenUtils.generateTokenWithRefreshToken(username);

        response.setHeader("Authorization", "Bearer " + newTokens.getAccessToken());
        
        // 새로운 RefreshToken 으로 쿠키 생성
        cookieUtils.setRefreshCookie(response, newTokens.getRefreshToken(), (int) refreshExpMin.getSeconds());
    }

    @Override
    public void signOut(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = tokenUtils.getTokenFromRequest(request);
        String username = tokenUtils.getUserNameFromToken(accessToken); // AccessToken 에서 username 파싱(email)
        tokenUtils.deleteRefreshToken(username); // Redis 에 저장된 refresh Token 삭제
        tokenBlackListService.addBlacklist(accessToken); // AccessToken 을 Redis 에 블랙리스트로 저장
        cookieUtils.setRefreshCookie(response, "", 0); // Refresh Token 쿠키 만료 처리
    }

    /**
     *
     * @param email
     * @return 인증코드(UUID)
     */
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
