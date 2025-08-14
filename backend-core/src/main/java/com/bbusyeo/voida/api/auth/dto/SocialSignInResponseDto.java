package com.bbusyeo.voida.api.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * 소셜 로그인 응답 DTO
 */
@ToString
@Getter
@Builder
public class SocialSignInResponseDto {
    private Boolean isFirstLogin;
    private Boolean isNewbie;
    private Integer code;

    public String toQueryParams() {
        return UriComponentsBuilder.newInstance()
                .queryParam("code", 200)
                .queryParam("isFirstLogin", isFirstLogin)
                .queryParam("isNewbie", isNewbie)
                .build().getQuery();
    }
}
