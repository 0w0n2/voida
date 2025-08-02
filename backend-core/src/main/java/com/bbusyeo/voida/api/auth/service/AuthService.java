package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.*;
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

    CheckNicknameResponseDto checkNickname(CheckNicknameRequestDto requestDto);
}
