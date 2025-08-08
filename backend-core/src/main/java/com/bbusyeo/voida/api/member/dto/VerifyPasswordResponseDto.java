package com.bbusyeo.voida.api.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class VerifyPasswordResponseDto {
    private Boolean isMatched;

    public static VerifyPasswordResponseDto toDto(boolean isMatched) {
        return VerifyPasswordResponseDto.builder()
                .isMatched(isMatched)
                .build();
    }
}
