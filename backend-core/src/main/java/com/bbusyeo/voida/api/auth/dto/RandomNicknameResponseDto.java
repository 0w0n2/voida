package com.bbusyeo.voida.api.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Builder
public class RandomNicknameResponseDto {
    String nickname;

    public static RandomNicknameResponseDto toDto(String nickname) {
        return RandomNicknameResponseDto.builder()
                .nickname(nickname)
                .build();
    }
}
