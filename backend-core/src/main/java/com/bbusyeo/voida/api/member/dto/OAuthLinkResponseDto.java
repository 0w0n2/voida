package com.bbusyeo.voida.api.member.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class OAuthLinkResponseDto {
    private String redirectUrl;

    public static OAuthLinkResponseDto toDto(String redirectUrl) {
        return OAuthLinkResponseDto.builder()
                .redirectUrl(redirectUrl).build();
    }
}
