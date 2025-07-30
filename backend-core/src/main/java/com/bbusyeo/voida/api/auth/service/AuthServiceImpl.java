package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final TokenUtils tokenUtils;
    private final RedisDao redisDao;

    @Value("${jwt.expire-time.refresh}")
    private Duration refreshExpMin;

    @Override
    public void refreshAccessToken(String refreshToken, HttpServletResponse response) {
        if (tokenUtils.validateToken(refreshToken)) {
            throw new BaseException(BaseResponseStatus.INVALID_JWT_TOKEN);
        }   // 필터 잘 설정해두면 매번 이거 안 해도 될 거 같은데...

        String username = tokenUtils.getUserNameFromToken(refreshToken);
        Object redisSavedRefreshToken = redisDao.getValue(username);

        if (!refreshToken.equals(redisSavedRefreshToken)) {
            throw new BaseException(BaseResponseStatus.INVALID_JWT_TOKEN);
        }

        JwtToken newTokens = tokenUtils.generateTokenWithRefreshToken(username);

        response.setHeader("Authorization", "Bearer " + newTokens.getAccessToken());

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newTokens.getRefreshToken())
                .httpOnly(true)
                .secure(false) // TODO-SECURITY: 개발 후엔 true로
                .path("/")
                .maxAge((int) refreshExpMin.getSeconds())
                .build();
        response.addHeader("Set-Cookie", refreshCookie.toString());
    }

    @Override
    public void signOut(HttpServletResponse response) {
        // 로그아웃시
        // 1. redis에 RefreshToken 삭제
        // 2. cookie 0
        // 3. AccessToken blacklist 등록
    }
}
