package com.bbusyeo.voida.global.ai.stt.dto;

import lombok.Getter;

@Getter
public class GMSSttResponseDto {
    private String text;
    private Usage usage;

    public static class Usage {
        private String type;
        private int seconds;
    }
}
