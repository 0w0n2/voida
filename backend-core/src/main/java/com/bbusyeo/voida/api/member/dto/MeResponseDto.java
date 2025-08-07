package com.bbusyeo.voida.api.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@Builder
public class MeResponseDto {
    private MeProfileResponseDto member;

    public static MeResponseDto fromMeProfileResponseDto(MeProfileResponseDto profileDto) {
        return MeResponseDto.builder()
                .member(profileDto)
                .build();
    }
}
