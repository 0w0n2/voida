package com.bbusyeo.voida.api.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
@Builder
public class MeResponseInfoDto {
    private MeProfileResponseInfoDto member;
    private MeSettingResponseInfoDto setting;
    private List<MeQuickSlotsResponseInfoDto> quickSlots;

    public static MeResponseInfoDto toMeResponseDto(MeProfileResponseInfoDto profileDto) {
        return MeResponseInfoDto.builder()
                .member(profileDto)
                .build();
    }

    public static MeResponseInfoDto toMeResponseDto(MeSettingResponseInfoDto settingDto) {
        return MeResponseInfoDto.builder()
                .setting(settingDto)
                .build();
    }

    public static MeResponseInfoDto toMeResponseDto(List<MeQuickSlotsResponseInfoDto> quickSlotsDto) {
        return MeResponseInfoDto.builder()
                .quickSlots(quickSlotsDto)
                .build();
    }
}
