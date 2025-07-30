package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    public void refreshAccessToken(String refreshToken, HttpServletResponse response);
    public void signOut(HttpServletResponse response);
}
