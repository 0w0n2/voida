package com.bbusyeo.voida.api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 이메일 코드 검증 요청 DTO
 */
@Getter
@ToString
@NoArgsConstructor
public class VerifyEmailRequestDto {

    @Email(message = "올바른 이메일 형식이 아닙니다.")
    @NotBlank(message = "이메일을 입력해주세요.")
    private String email;
    @NotBlank(message = "이메일 인증 코드를 입력해주세요.")
    private String code;
}
