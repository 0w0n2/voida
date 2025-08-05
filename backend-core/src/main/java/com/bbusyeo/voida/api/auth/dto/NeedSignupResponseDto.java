package com.bbusyeo.voida.api.auth.dto;

import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NeedSignupResponseDto {
    private final String email;
    private final String providerName;
    private final String signUpToken;

    public static NeedSignupResponseDto toDto(OAuth2UserInfo oAuth2UserInfo, String signUpToken) {
        return NeedSignupResponseDto.builder()
                .email(oAuth2UserInfo.getProviderEmail())
                .providerName(oAuth2UserInfo.getProvider())
                .signUpToken(signUpToken)
                .build();
    }
}
