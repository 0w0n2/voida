package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.VerifyEmailRequestDto;
import com.bbusyeo.voida.api.auth.dto.VerifyEmailResponseDto;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final String SIGNUP_CODE_PREFIX = "signup-code:";
    private final Duration signUpMailCodeExpMin = Duration.ofMinutes(5);

    private final RedisDao redisDao;

    public VerificationCode generateVerificationCode(String email) {
        String code = UUID.randomUUID().toString().substring(0, 6);

        String redisKey = SIGNUP_CODE_PREFIX + email;
        redisDao.setValue(redisKey, code, signUpMailCodeExpMin); // value: signup-code:email, key: code(UUID)

        String expiredAt = LocalDateTime.now().plus(signUpMailCodeExpMin)
                .format(DateTimeFormatter.ISO_DATE_TIME);

        return VerificationCode.builder()
                .code(code)
                .expiredAt(expiredAt).build();
    }

    public VerifyEmailResponseDto verifyEmailCode(VerifyEmailRequestDto requestDto) {
        String redisKey = SIGNUP_CODE_PREFIX + requestDto.getEmail();
        Object redisCode = redisDao.getValue(redisKey);
        if (redisCode == null) { // redis 에 key 존재 X -> TTL 완료
            return VerifyEmailResponseDto.toDto(false, true); // 만료 O
        }
        boolean isMatch = redisCode.toString().equals(requestDto.getCode());
        return VerifyEmailResponseDto.toDto(isMatch, false);
    }

}
