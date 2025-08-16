package com.bbusyeo.voida.global.security.constant;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class OAuth2Value {
    // 소셜 연동 관련
    public static final String SOCIAL_SIGNUP_TOKEN_PREFIX = "social-signup-token:";
    public static final String SOCIAL_LINK_TOKEN_PREFIX = "social-link-token:";
    public static final String SOCIAL_LINK_SESSION_NAME = "social-link-request";
    public static final String SOCIAL_LINK_SESSION_TOKEN_NAME = "social-link-token";
}
