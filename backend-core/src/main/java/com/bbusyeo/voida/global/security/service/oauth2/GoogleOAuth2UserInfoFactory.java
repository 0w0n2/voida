package com.bbusyeo.voida.global.security.service.oauth2;

import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.global.security.dto.GoogleUserInfo;
import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
public class GoogleOAuth2UserInfoFactory implements OAuth2UserInfoFactory {
    @Override
    public boolean supports(ProviderName providerName) {
        return ProviderName.GOOGLE.equals(providerName);
    }

    @Override
    public OAuth2UserInfo create(OAuth2User oAuth2User) {
        return new GoogleUserInfo(oAuth2User.getAttributes());
    }
}
