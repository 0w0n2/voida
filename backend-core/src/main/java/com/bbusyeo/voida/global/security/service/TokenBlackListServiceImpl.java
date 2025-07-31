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
    // key: blacklist:AccessToken 형식으로 저장
    // value: 해당 AccessToken 이 블랙리스트로 등록되어있는지 여부만 체크하므로 중요하지 X (-> 빈 문자열)
    
    // 남은 만료 시간을 구한 뒤 redis 에 해당 AccessToken 을 blacklist로 등록
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
    
    // 해당 AccessToken 이 블랙리스트에 존재하는지 확인
    @Override
    public boolean isBlacklisted(String token) { // true: blacklist 등록됨, false: blacklist 아님
        String key = BLACKLIST_PREFIX + token;
        return redisDao.getValue(key) != null;
    }
}
