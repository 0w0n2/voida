package com.bbusyeo.voida.global.security.service.oauth2;

import com.bbusyeo.voida.api.member.domain.MemberSocial;
import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSocialRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.GuestOAuth2UserDto;
import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOauth2UserService extends DefaultOAuth2UserService {

    private final MemberSocialRepository memberSocialRepository;
    private final MemberRepository memberRepository;
    private final List<OAuth2UserInfoFactory> oAuth2UserInfoFactories;

    @Override
    @Transactional(readOnly = true)
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Provider enum 변환
        ProviderName providerName = ProviderName.from(userRequest.getClientRegistration().getRegistrationId());
        
        // Provider 별로 OAuth2UserInfo 구현체 선택
        OAuth2UserInfo oAuth2UserInfo = oAuth2UserInfoFactories.stream()
                .filter(factory -> factory.supports(providerName))
                .findFirst()
                .map(factory -> factory.create(oAuth2User))
                .orElseThrow(() -> oauth2Exception(BaseResponseStatus.UNSUPPORTED_SOCIAL_PROVIDER));

        // Handler 에 내려줄 유저 정보 객체 생성
        String providerEmail = oAuth2UserInfo.getProviderEmail();
        Optional<MemberSocial> memberSocial = memberSocialRepository.findByEmail(providerEmail);

        // 1. 요청 성공 (CustomOAuth2SuccessHandler 에서 처리)
        if (memberSocial.isPresent()) { // 1-1. 기존에 가입한 소셜 계정 -> 로그인 진행
            return new UserDetailsDto(memberSocial.get().getMember());
        } else if (memberRepository.existsByEmailAndIsDeletedIsFalse(providerEmail)){
            // 2. 요청 실패 (CustomOAuth2FailureHandler 에서 처리)
            // 최초 로그인이나 동일한 이메일 주소로 일반 회원가입이 되어 있음
            throw oauth2Exception(BaseResponseStatus.ALREADY_REGISTERED_EMAIL);
        }
        return new GuestOAuth2UserDto(oAuth2UserInfo); // 1-2. 최초 소셜 로그인 사용자 -> 해당 이메일 주소로 일반 회원가입 진행
    }

    private OAuth2AuthenticationException oauth2Exception(BaseResponseStatus status) {
        return new OAuth2AuthenticationException(
                new OAuth2Error(status.name().toLowerCase()),
                new BaseException(status)
        );
    }
}
