package com.bbusyeo.voida.global.ai.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OpenAITtsRequestDto {
    private String model;
    private String input;
    private String voice;
    private String response_format;
}
