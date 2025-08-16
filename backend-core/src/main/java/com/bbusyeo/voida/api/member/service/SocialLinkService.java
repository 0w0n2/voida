package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.api.member.dto.OAuthLinkResponseDto;
import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import jakarta.servlet.http.HttpServletRequest;

public interface SocialLinkService {

    OAuthLinkResponseDto initialSocialLink(HttpServletRequest request, Member member, String providerName);

    UserDetailsDto linkAccount(ProviderName providerName, String linkToken, OAuth2UserInfo socialUserInfo);

}
