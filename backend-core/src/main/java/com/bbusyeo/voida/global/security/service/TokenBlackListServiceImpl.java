package com.bbusyeo.voida.global.security.service;

import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class TokenBlackListServiceImpl implements TokenBlackListService {
    private final RedisDao redisDao;
    private final TokenUtils tokenUtils;
    private static final String BLACKLIST_PREFIX = "blacklist:";

    @Override
    public void addBlacklist(String token) {
        String key = BLACKLIST_PREFIX + token;
        Claims claims = tokenUtils.parseClaims(token);
        Date expiration = (Date) claims.getExpiration();
        long now = new Date().getTime();
        long remainingExpiration = expiration.getTime() - now;
        if (remainingExpiration > 0) { // 남은 만료 시간만큼 블랙리스트로 관리
            redisDao.setValue(key, "", Duration.ofMillis(remainingExpiration));
        }
    }

    @Override
    public boolean isBlacklisted(String token) {
        String key = BLACKLIST_PREFIX + token;
        return redisDao.getValue(key) != null;
    }
}
