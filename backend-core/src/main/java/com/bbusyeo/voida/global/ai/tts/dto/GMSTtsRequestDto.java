package com.bbusyeo.voida.global.ai.tts.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GMSTtsRequestDto {
    private String model;
    private String input;
    private String voice;
    private String response_format;

    // voice 와 response_format 은 기본값으로 하드코딩
    public static GMSTtsRequestDto toDto(String model, String message) {
        return GMSTtsRequestDto.builder()
                .model(model)
                .voice("onyx")
                .input(message)
                .response_format("mp3")
                .build();
    }
}
