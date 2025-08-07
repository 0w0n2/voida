package com.bbusyeo.voida.api.member.dto;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.MemberSetting;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Builder
@Getter
public class MeSettingResponseDto {
    private Boolean lipTalkMode;
    private String overlayPosition;
    private int liveFontSize;
    private int overlayTransparency;

    public static MeSettingResponseDto toDto(MemberSetting memberSetting){
        return MeSettingResponseDto.builder()
                .lipTalkMode(memberSetting.getLipTalkMode())
                .liveFontSize(memberSetting.getLiveFontSize())
                .overlayPosition(memberSetting.getOverlayPosition().toString())
                .build();
    }
}
