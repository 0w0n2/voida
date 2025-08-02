package com.bbusyeo.voida.api.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 이메일 인증 코드 발급 요청 DTO
 */
@Getter
@ToString
@NoArgsConstructor
public class EmailCodeRequestDto {
    private String email;
}
