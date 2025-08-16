package com.bbusyeo.voida.global.security.util;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.constant.OAuth2Value;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.stereotype.Component;

@Component
public class OAuth2Utils {

    public OAuth2AuthenticationException oauth2Exception(BaseResponseStatus status) {
        return new OAuth2AuthenticationException(
                new OAuth2Error(status.name().toLowerCase()),
                new BaseException(status)
        );
    }

    public boolean isSocialLink(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return isSocialLink(session);
    }

    public boolean isSocialLink(HttpSession session) {
        return session != null && "true".equals(session.getAttribute(OAuth2Value.SOCIAL_LINK_SESSION_NAME));
    }

}
