package com.bbusyeo.voida.global.redis.dao;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Set;

/**
 * Redis 접근을 위한 클래스
 */
@Slf4j
@Component
public class RedisDao {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ValueOperations<String, Object> values;
    private final SetOperations<String, Object> setOps;

    public RedisDao(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.values = redisTemplate.opsForValue(); // String 타입을 쉽게 처리하는 메서드
        this.setOps = redisTemplate.opsForSet();
    }

    // 기본 데이터 저장
    public void setValue(String key, Object value) {
        values.set(key, value);
    }

    // 만료 시간이 있는 데이터 저장(Ex. RefreshToken)
    public void setValue(String key, Object value, Duration duration) {
        values.set(key, value, duration);
    }

    // 데이터 조회
    public Object getValue(String key) {
        return values.get(key);
    }

    // 데이터 삭제
    public void deleteValue(String key) {
        redisTemplate.delete(key);
    }

    // Set 타입에 값 추가
    public void addSetValue(String key, Object value) {
        setOps.add(key, value);
    }

    // Set 타입에 값 제거
    public void deleteSetValue(String key, Object value) {
        setOps.remove(key, value);
    }

    public Set<Object> getSetValue(String key) {
        return setOps.members(key);
    }
}
