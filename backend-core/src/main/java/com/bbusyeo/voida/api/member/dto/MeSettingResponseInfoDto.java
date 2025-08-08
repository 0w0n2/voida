package com.bbusyeo.voida.api.member.dto;

import com.bbusyeo.voida.api.member.domain.MemberSetting;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Builder
@Getter
public class MeSettingResponseInfoDto {
    private Boolean lipTalkMode;
    private String overlayPosition;
    private int liveFontSize;
    private int overlayTransparency;

    public static MeSettingResponseInfoDto toDto(MemberSetting memberSetting){
        return MeSettingResponseInfoDto.builder()
                .lipTalkMode(memberSetting.getLipTalkMode())
                .liveFontSize(memberSetting.getLiveFontSize())
                .overlayPosition(memberSetting.getOverlayPosition().toString())
                .build();
    }
}
