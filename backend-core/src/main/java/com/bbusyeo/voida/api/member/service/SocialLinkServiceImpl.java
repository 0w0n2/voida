package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.api.member.dto.OAuthLinkResponseDto;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSocialRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.constant.OAuth2Value;
import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SocialLinkServiceImpl implements SocialLinkService {

    private final RedisDao redisDao;
    private final MemberRepository memberRepository;
    private final MemberSocialRepository memberSocialRepository;

    @Value("${voida.social.sign-up-expire-time}")
    private Duration socialLinkExpMin;

    @Value("${security.oauth.authorization-endpoint}")
    private String authorizationEndpoint;
    
    // 소셜 연동을 시작하는 메소드, 세션에 정보를 저장하고 접속해야할 경로를 프론트에게 응답
    public OAuthLinkResponseDto initialSocialLink(HttpServletRequest request, Member member, String providerName) {
        // 이메일을 key로 redis에 OAuth 정보 저장
        String token = UUID.randomUUID().toString();
        String redisKey = OAuth2Value.SOCIAL_LINK_TOKEN_PREFIX + token;
        redisDao.setValue(redisKey, member.getMemberUuid(), socialLinkExpMin);

        request.getSession().setAttribute(OAuth2Value.SOCIAL_LINK_SESSION_NAME, "true");
        request.getSession().setAttribute(OAuth2Value.SOCIAL_LINK_SESSION_TOKEN_NAME, token);
        String redirectUrl = "%s/%s".formatted(authorizationEndpoint, providerName);
        return OAuthLinkResponseDto.toDto(redirectUrl);
    }

    //
    @Override
    public UserDetailsDto linkAccount(ProviderName providerName, String linkToken, OAuth2UserInfo socialUserInfo) {
        String redisKey = OAuth2Value.SOCIAL_LINK_TOKEN_PREFIX + linkToken;
        Object currentMemberUuid = redisDao.getValue(redisKey);
        if (currentMemberUuid == null) {
            throw new BaseException(BaseResponseStatus.EXPIRED_SOCIAL_LINK);
        }

        // 이미 연동된 소셜 계정인지 확인
        memberSocialRepository.findByProviderNameAndProviderId(providerName, socialUserInfo.getProviderId())
                .ifPresent(ms -> {
                    throw new BaseException(BaseResponseStatus.SOCIAL_ACCOUNT_ALREADY_LINKED);
                });

        // 현재 사용자 정보 조회
        Member currentMember = memberRepository.findByMemberUuid(currentMemberUuid.toString())
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));

        // 연동된 정보로 UserDetailsDto 반환
        return new UserDetailsDto(currentMember, socialUserInfo);
    }
}
