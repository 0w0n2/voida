package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.dto.NeedSignupResponseDto;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class SocialSignUpService {

    private final RedisDao redisDao;
    private static final String SIGNUP_TOKEN_PREFIX = "signup-token:";

    @Value("${voida.social.sign-up-expire-time}")
    private Duration socialSignUpExpMin;

    // 소셜 로그인 시도 시 신규 회원일 경우, 회원가입 절차를 시작하는 메서드
    public NeedSignupResponseDto initialSocialSignUp(OAuth2UserInfo oAuth2UserInfo) {
        // 이메일을 key로 redis에 OAuth 정보 저장
        String redisKey = SIGNUP_TOKEN_PREFIX + oAuth2UserInfo.getProviderEmail();
        redisDao.setValue(redisKey, oAuth2UserInfo.getProviderId(), socialSignUpExpMin);
        return NeedSignupResponseDto.toDto(oAuth2UserInfo);
    }
}
