package com.bbusyeo.voida.api.auth.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class JwtToken {
    private String grantType;   // JWT에 대한 인증 타입(Bearer)
    private String accessToken;
    private String refreshToken;
}
