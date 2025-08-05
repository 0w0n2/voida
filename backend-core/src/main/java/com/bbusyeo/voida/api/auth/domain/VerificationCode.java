package com.bbusyeo.voida.api.auth.domain;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class VerificationCode {
    private String code;
    private String expiredAt;
}
