package com.bbusyeo.voida.api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 이메일 인증 코드 발급 요청 DTO
 */
@Getter
@ToString
@NoArgsConstructor
public class EmailCodeRequestDto {
    @Email
    @NotBlank(message = "이메일을 입력해주세요.")
    private String email;
}
