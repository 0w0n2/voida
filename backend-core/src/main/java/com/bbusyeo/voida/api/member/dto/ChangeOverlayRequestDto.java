package com.bbusyeo.voida.api.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class ChangeOverlayRequestDto {

    @NotBlank(message = "오버레이 위치를 입력해주세요.")
    private String overlayPosition;

    @NotNull(message = "오버레이 투명도를 입력해주세요.")
    private Integer overlayTransparency;

    @NotNull(message = "폰트 사이즈를 입력해주세요.")
    private Integer liveFontSize;

}
