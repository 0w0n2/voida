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
}
