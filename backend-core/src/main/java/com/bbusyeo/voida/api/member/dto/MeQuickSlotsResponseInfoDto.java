package com.bbusyeo.voida.api.member.dto;

import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@Builder
public class MeQuickSlotsResponseInfoDto {
    private Long quickSlotId;
    private String message;
    private String hotkey;
    private String url;

    public static MeQuickSlotsResponseInfoDto toDto(MemberQuickSlot memberQuickSlot) {
        return MeQuickSlotsResponseInfoDto.builder()
                .quickSlotId(memberQuickSlot.getId())
                .message(memberQuickSlot.getMessage())
                .hotkey(memberQuickSlot.getHotkey())
                .url(memberQuickSlot.getUrl())
                .build();
    }
}
