package com.bbusyeo.voida.global.security.service;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.MemberSocial;
import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSocialRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.GoogleUserInfo;
import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOauth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final MemberSocialRepository memberSocialRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("getAttributes : {}", oAuth2User.getAttributes());

        // Provider enum 변환
        ProviderName providerName = ProviderName.from(userRequest.getClientRegistration().getRegistrationId());
        
        // Provider 별로 OAuth2UserInfo 구현체 선택
        OAuth2UserInfo oAuth2UserInfo = switch (providerName) {
            case GOOGLE -> new  GoogleUserInfo(oAuth2User.getAttributes());
            default -> throw new BaseException(BaseResponseStatus.UNSUPPORTED_SOCIAL_PROVIDER);
        };

        String providerId = oAuth2UserInfo.getProviderId();
        String email = oAuth2UserInfo.getProviderEmail();

        // 소셜 조회
        Optional<MemberSocial> memberSocial = memberSocialRepository.findByProviderNameAndProviderId(providerName, providerId);
        Member member = null;
        if (memberSocial.isPresent()) {
            member = memberSocial.get().getMember(); // 소셜 계정 정보로 멤버 조회
        }
        
        // 신규 소설 로그인 사용자 -> SuccessHandler 에서 처리
        return new UserDetailsDto(member, oAuth2UserInfo, memberSocial.isPresent());
    }
}
