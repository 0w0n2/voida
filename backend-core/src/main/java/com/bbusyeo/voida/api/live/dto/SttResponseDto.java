package com.bbusyeo.voida.api.live.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SttResponseDto {
    private String text;
    private String sessionId;

    public static SttResponseDto toDto(String text, String sessionId) {
        return SttResponseDto.builder()
                .text(text)
                .sessionId(sessionId)
                .build();
    }
}
