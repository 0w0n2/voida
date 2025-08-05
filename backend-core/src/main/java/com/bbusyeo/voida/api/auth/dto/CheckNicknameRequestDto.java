package com.bbusyeo.voida.api.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class CheckNicknameRequestDto {
    @NotBlank(message = "닉네임을 입력해주세요.")
    private String nickname;
}
