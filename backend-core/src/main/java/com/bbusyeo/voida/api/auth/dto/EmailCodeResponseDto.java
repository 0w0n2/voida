package com.bbusyeo.voida.api.auth.dto;

import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Builder
@Getter
public class EmailCodeResponseDto {
    private String expiredAt;

    public static EmailCodeResponseDto toDto(VerificationCode verificationCode) {
        return EmailCodeResponseDto.builder()
                .expiredAt(verificationCode.getExpiredAt())
                .build();
    }
}
