package com.bbusyeo.voida.api.member.dto;

import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@Builder
public class MeQuickSlotsRequestInfoDto {

    @NotNull(message = "퀵슬롯 아이디를 입력해주세요.")
    private Long quickSlotId;

    @NotBlank(message = "메시지를 입력해주세요.")
    private String message;

    @NotBlank(message = "단축키를 입력해주세요.")
    private String hotkey;

}
