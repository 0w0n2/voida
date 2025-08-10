package com.bbusyeo.voida.api.member.domain.enums;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.Getter;

import java.util.Locale;

@Getter
public enum OverlayPosition {
    TOPLEFT,
    TOPRIGHT,
    BOTTOMLEFT,
    BOTTOMRIGHT;

    public static OverlayPosition from(String overlayPosition) {
        try {
            return OverlayPosition.valueOf(overlayPosition.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new BaseException(BaseResponseStatus.UNSUPPORTED_OVERLAY_POSITION);
        }

    }
}
