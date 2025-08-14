package com.bbusyeo.voida.global.security.service.oauth2;

import com.bbusyeo.voida.api.member.domain.MemberSocial;
import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSocialRepository;
import com.bbusyeo.voida.api.member.service.SocialLinkService;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.constant.OAuth2Value;
import com.bbusyeo.voida.global.security.dto.GuestOAuth2UserDto;
import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.util.OAuth2Utils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOauth2UserService extends DefaultOAuth2UserService {

    private final MemberSocialRepository memberSocialRepository;
    private final MemberRepository memberRepository;
    private final List<OAuth2UserInfoFactory> oAuth2UserInfoFactories;
    private final SocialLinkService socialLinkService;
    private final OAuth2Utils oAuth2Utils;

    /**
     * 소셜 정보 또는 멤버 정보를 담은 OAuth2User(UserDetails) 객체를 생성
     * - 요청 성공 (CustomOAuth2SuccessHandler 에서 처리)
     * - 요청 실패 (CustomOAuth2FailureHandler 에서 처리)
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oAuth2User = super.loadUser(userRequest);
            ProviderName providerName = ProviderName.from(userRequest.getClientRegistration().getRegistrationId());

            // Provider 별로 OAuth2UserInfo 구현체 선택
            OAuth2UserInfo oAuth2UserInfo = oAuth2UserInfoFactories.stream()
                    .filter(factory -> factory.supports(providerName))
                    .findFirst()
                    .map(factory -> factory.create(oAuth2User))
                    .orElseThrow(() -> new BaseException(BaseResponseStatus.UNSUPPORTED_SOCIAL_PROVIDER));

            // 소셜 연동 요청인지 체크
            Optional<HttpSession> sessionOpt = getSession();
            if (sessionOpt.isPresent() && oAuth2Utils.isSocialLink(sessionOpt.get())) {
                String linkToken = sessionOpt.get().getAttribute(OAuth2Value.SOCIAL_LINK_SESSION_TOKEN_NAME).toString();
                return socialLinkService.linkAccount(providerName, linkToken, oAuth2UserInfo);
            }

            // Handler 에 내려줄 유저 정보 객체 생성
            Optional<MemberSocial> memberSocial = memberSocialRepository.findByProviderNameAndProviderId(providerName, oAuth2UserInfo.getProviderId());

            if (memberSocial.isPresent()) { // 기존에 가입한 소셜 계정 -> 로그인 진행
                return new UserDetailsDto(memberSocial.get().getMember());
            } else if (memberRepository.existsByEmailAndIsDeletedIsFalse(oAuth2UserInfo.getProviderEmail())) {
                throw new BaseException(BaseResponseStatus.ALREADY_REGISTERED_EMAIL); // 최초 로그인이나 동일한 이메일 주소로 일반 회원가입이 되어 있음
            }
            return new GuestOAuth2UserDto(oAuth2UserInfo); // 최초 소셜 로그인 사용자 -> 해당 이메일 주소로 일반 회원가입 진행
        } catch (BaseException e) {
            throw oAuth2Utils.oauth2Exception(e.getStatus());
        }
    }

    private Optional<HttpSession> getSession() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = attr.getRequest();
        return Optional.ofNullable(request.getSession(false));
    }
}
