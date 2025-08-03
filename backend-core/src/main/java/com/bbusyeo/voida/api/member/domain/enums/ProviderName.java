package com.bbusyeo.voida.api.member.domain.enums;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Locale;

@Getter
@ToString
@NoArgsConstructor
public enum ProviderName {
    GOOGLE,
    KAKAO,
    NAVER;

    public static ProviderName from(String providerName) {
        if (providerName == null) throw new BaseException(BaseResponseStatus.UNSUPPORTED_SOCIAL_PROVIDER);
        try {
            return ProviderName.valueOf(providerName.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new BaseException(BaseResponseStatus.UNSUPPORTED_SOCIAL_PROVIDER);
        }
    }
}
