package com.bbusyeo.voida.api.auth.dto;

import com.bbusyeo.voida.global.security.dto.OAuth2UserInfo;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.util.UriComponentsBuilder;

@Getter
@Builder
public class NeedSignupResponseDto {
    private final Boolean isFirstLogin;
    private final String email;
    private final String providerName;
    private final Integer code;

    public static NeedSignupResponseDto toDto(OAuth2UserInfo oAuth2UserInfo) {
        return NeedSignupResponseDto.builder()
                .isFirstLogin(true)
                .email(oAuth2UserInfo.getProviderEmail())
                .providerName(oAuth2UserInfo.getProvideName())
                .build();
    }

    public String toQueryParams() {
        return UriComponentsBuilder.newInstance()
                .queryParam("code", 200)
                .queryParam("isFirstLogin", isFirstLogin)
                .queryParam("email", email)
                .queryParam("providerName", providerName)
                .build().getQuery();
    }
}
