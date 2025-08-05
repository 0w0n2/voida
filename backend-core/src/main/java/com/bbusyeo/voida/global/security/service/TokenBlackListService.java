package com.bbusyeo.voida.global.security.service;

import org.springframework.stereotype.Service;

/**
 * Redis 내에 AccessToken BlackList 를 관리
 */
@Service
public interface TokenBlackListService {

    void addBlacklistRefresh(String token);      // Redis key-value 형태로 리스트 추가

    void addBlacklistAccess(String token);

    boolean isBlacklistedRefresh(String token);

    boolean isBlacklistedAccess(String token);   // Redis Key 기반으로 리스트 조회
}
