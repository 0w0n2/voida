package com.bbusyeo.voida.api.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

/**
 * 이메일 코드 검증 응답 DTO
 */
@ToString
@Getter
@Builder
public class VerifyEmailResponseDto {
    private Boolean verified; // 인증 성공 여부
    private Boolean expired; // 인증 코드 만료 여부 (true= 만료됨)

    static public VerifyEmailResponseDto toDto(Boolean verified, Boolean expired) {
        return VerifyEmailResponseDto.builder()
                .verified(verified)
                .expired(expired)
                .build();
    }
}
