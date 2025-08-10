package com.bbusyeo.voida.api.member.domain.enums;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.util.StringUtils;

import java.util.Locale;

@Getter
@ToString
public enum ProviderName {
    GOOGLE("google"),
    KAKAO("kakao"),
    NAVER("naver");

    public static ProviderName from(String providerName) {
        if (!StringUtils.hasText(providerName)) {
            throw new BaseException(BaseResponseStatus.UNSUPPORTED_SOCIAL_PROVIDER);
        }
        try {
            return ProviderName.valueOf(providerName.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new BaseException(BaseResponseStatus.UNSUPPORTED_SOCIAL_PROVIDER);
        }
    }

    private final String providerName;

    ProviderName(String providerName) {
        this.providerName = providerName;
    }
}
