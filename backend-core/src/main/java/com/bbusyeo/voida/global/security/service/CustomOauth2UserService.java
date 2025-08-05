package com.bbusyeo.voida.global.security.service;

import com.bbusyeo.voida.api.member.domain.MemberSocial;
import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSocialRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.GoogleUserInfo;
import com.bbusyeo.voida.global.security.dto.GuestOAuth2UserDto;
import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final MemberSocialRepository memberSocialRepository;
    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Provider enum 변환
        ProviderName providerName = ProviderName.from(userRequest.getClientRegistration().getRegistrationId());
        
        // Provider 별로 OAuth2UserInfo 구현체 선택
        OAuth2UserInfo oAuth2UserInfo = switch (providerName) {
            case GOOGLE -> new GoogleUserInfo(oAuth2User.getAttributes());
            default -> throw new BaseException(BaseResponseStatus.UNSUPPORTED_SOCIAL_PROVIDER);
        };

        String providerEmail = oAuth2UserInfo.getProviderEmail();

        // 소셜 테이블 정보 조회
        Optional<MemberSocial> memberSocial = memberSocialRepository.findByEmail(providerEmail);

        if (memberSocial.isPresent()) {
            // 기존에 가입한 소셜 계정 -> 로그인 진행
            return new UserDetailsDto(memberSocial.get().getMember());
        } else if (memberRepository.existsByEmail(providerEmail)) {
            // 최초 로그인이나 동일한 이메일 주소로 일반 회원가입이 되어 있음 -> Exception
            throw new BaseException(BaseResponseStatus.ALREADY_REGISTERED_EMAIL);
        } else { // 최초 소셜 로그인 사용자 -> 해당 이메일 주소로 일반 회원가입 진행
            return new GuestOAuth2UserDto(oAuth2UserInfo);
        }
    }
}
