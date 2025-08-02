package com.bbusyeo.voida.api.auth.domain;

import lombok.Getter;

import java.time.Duration;
import java.util.UUID;

@Getter
public class RefreshToken {
    private String token;
    private Duration expiredAt;

    public RefreshToken(Duration expiredAt) {
        this.token = UUID.randomUUID().toString();
        this.expiredAt = expiredAt;
    }
}
