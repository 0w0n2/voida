package com.bbusyeo.voida.api.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
@Builder
public class MeResponseDto {
    private MeProfileResponseDto member;
    private MeSettingResponseDto setting;
    private List<MeQuickSlotsResponseDto> quickSlots;

    public static MeResponseDto toMeResponseDto(MeProfileResponseDto profileDto) {
        return MeResponseDto.builder()
                .member(profileDto)
                .build();
    }

    public static MeResponseDto toMeResponseDto(MeSettingResponseDto settingDto) {
        return MeResponseDto.builder()
                .setting(settingDto)
                .build();
    }

    public static MeResponseDto toMeResponseDto(List<MeQuickSlotsResponseDto> quickSlotsDto) {
        return MeResponseDto.builder()
                .quickSlots(quickSlotsDto)
                .build();
    }
}
