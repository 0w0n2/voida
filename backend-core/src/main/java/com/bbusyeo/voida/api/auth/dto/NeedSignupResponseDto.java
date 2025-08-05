package com.bbusyeo.voida.api.auth.dto;

import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NeedSignupResponseDto {
    private final String email;
    private final String providerName;

    public static NeedSignupResponseDto toDto(OAuth2UserInfo oAuth2UserInfo) {
        return NeedSignupResponseDto.builder()
                .email(oAuth2UserInfo.getProviderEmail())
                .providerName(oAuth2UserInfo.getProvideName())
                .build();
    }
}
