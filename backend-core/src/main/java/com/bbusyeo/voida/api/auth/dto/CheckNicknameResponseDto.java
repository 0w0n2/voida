package com.bbusyeo.voida.api.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@Builder
public class CheckNicknameResponseDto {
    private Boolean nicknameDuplicated;

    public static CheckNicknameResponseDto toDto(Boolean nicknameDuplicated) {
        return CheckNicknameResponseDto.builder()
                .nicknameDuplicated(nicknameDuplicated)
                .build();
    }
}
