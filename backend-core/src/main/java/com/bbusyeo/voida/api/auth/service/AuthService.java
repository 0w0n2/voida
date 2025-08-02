package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.SignInRequestDto;
import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.api.auth.dto.VerifyEmailRequestDto;
import com.bbusyeo.voida.api.auth.dto.VerifyEmailResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    SignInResponseDto signIn(SignInRequestDto requestDto, HttpServletResponse response);

    void refreshAccessToken(String refreshToken, HttpServletResponse response);

    void signOut(HttpServletRequest request, HttpServletResponse response);

    VerificationCode generateVerificationCode(String email);

    VerifyEmailResponseDto verifyEmailCode(VerifyEmailRequestDto requestDto);
}
