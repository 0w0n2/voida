package com.bbusyeo.voida.api.member.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@Builder
public class VerifyPasswordRequestDto {

    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String password;

}
