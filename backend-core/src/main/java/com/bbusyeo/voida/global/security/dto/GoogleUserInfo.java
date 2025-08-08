package com.bbusyeo.voida.global.security.dto;

import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

@Getter
@AllArgsConstructor
public class GoogleUserInfo implements OAuth2UserInfo {
    private Map<String, Object> attributes;

    @Override
    public String getProviderId() {
        return (String) attributes.get("sub");
    }

    @Override
    public String getProviderEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getProvideName() {
        return ProviderName.GOOGLE.getProviderName();
    }
}
