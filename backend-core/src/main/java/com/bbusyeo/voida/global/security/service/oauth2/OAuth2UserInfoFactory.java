package com.bbusyeo.voida.global.security.service.oauth2;

import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface OAuth2UserInfoFactory {
    boolean supports(ProviderName providerName);

    OAuth2UserInfo create(OAuth2User oAuth2User);
}
