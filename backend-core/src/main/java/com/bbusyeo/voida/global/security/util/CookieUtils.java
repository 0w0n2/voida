package com.bbusyeo.voida.global.security.util;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtils {

    // RefreshToken 으로 쿠키를 생성하거나 만료시키는 메소드
    public void setRefreshCookie(HttpServletResponse response, String refreshToken, int time) {
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken) // 쿠키값을 null 로 설정
                .httpOnly(true) // JavaScript
                .secure(true)  // TODO-SECURITY: Https 사용하므로 개발 후엔 true로 (그런데 TCP 연결이라 false로 해달라는 요청이 있었음)
                .path("/")
                .maxAge(time) // maxAge를 0으로 설정하여 즉시 만료
                .sameSite("None")
                .build();
        response.addHeader("Set-Cookie", refreshCookie.toString()); // Response Headers에 Set-Cookie 항목이 보이고, Cookies 탭에도 나타남 // response.addCookie(refreshCookie);
    }
}
