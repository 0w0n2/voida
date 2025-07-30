package com.bbusyeo.voida.global.security.service;

import com.bbusyeo.voida.global.redis.dao.RedisDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Redis 내에 AccessToken BlackList 를 관리
 */
@Service
public interface TokenBlackListService {

    void addBlacklist(String token);      // Redis key-value 형태로 리스트 추가
    boolean isBlacklisted(String token);   // Redis Key 기반으로 리스트 조회
}
