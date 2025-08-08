package com.bbusyeo.voida.api.member.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class ChangeLipTalkMode {

    @NotNull(message = "구화 사용 여부를 입력해주세요.")
    private Boolean useLipTalkMode;

}
