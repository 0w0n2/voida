package com.bbusyeo.voida.api.auth.dto;

import com.bbusyeo.voida.api.member.domain.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

/**
 * 일반 로그인 응답 DTO
 */
@ToString
@Getter
@Builder
public class SignInResponseDto {
    private Boolean isNewbie;

    static public SignInResponseDto toDto(Member member) {
        return SignInResponseDto.builder()
                .isNewbie(member.getIsNewbie())
                .build();
    }
}
