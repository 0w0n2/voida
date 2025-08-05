package com.bbusyeo.voida.api.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@Builder
public class CheckEmailResponseDto {
    private Boolean emailDuplicated;

    public static CheckEmailResponseDto toDto(Boolean emailDuplicated) {
        return CheckEmailResponseDto.builder()
                .emailDuplicated(emailDuplicated)
                .build();
    }
}
