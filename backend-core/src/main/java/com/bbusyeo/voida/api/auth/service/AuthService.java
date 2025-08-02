package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.EmailCodeResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    public void refreshAccessToken(String refreshToken, HttpServletResponse response);
    public void signOut(HttpServletRequest request, HttpServletResponse response);
    public VerificationCode generateVerificationCode(String email);
}
