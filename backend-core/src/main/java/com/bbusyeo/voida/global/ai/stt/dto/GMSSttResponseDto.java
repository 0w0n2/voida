package com.bbusyeo.voida.global.ai.stt.dto;

import lombok.Data;

// @Getter
@Data
public class GMSSttResponseDto {
    private String text;
    private Usage usage;

    @Data
    public static class Usage {
        private String type;
        private int seconds;
    }
}
