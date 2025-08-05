package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final NicknameService nicknameService;
    private final ResetPasswordService resetPasswordService;
    private final SignUpService signUpService;
    private final TokenAuthService tokenAuthService;
    private final EmailVerificationService emailVerificationService;

    @Override
    public SignInResponseDto signIn(SignInRequestDto requestDto, HttpServletResponse response) {
        return tokenAuthService.signIn(requestDto, response);
    }

    @Override
    public void refreshAccessToken(String refreshToken, HttpServletResponse response) {
        tokenAuthService.refreshAccessToken(refreshToken, response);
    }


    @Override
    public void signOut(HttpServletRequest request, HttpServletResponse response) {
        tokenAuthService.signOut(request, response);
    }

    @Override
    public VerificationCode generateVerificationCode(String email) {
        return emailVerificationService.generateVerificationCode(email);
    }

    @Override
    public VerifyEmailResponseDto verifyEmailCode(VerifyEmailRequestDto requestDto) {
        return emailVerificationService.verifyEmailCode(requestDto);
    }

    @Override
    public CheckNicknameResponseDto checkNickname(CheckNicknameRequestDto requestDto) {
        return nicknameService.checkNickname(requestDto);
    }

    @Override
    public RandomNicknameResponseDto getRandomNickname() {
        return RandomNicknameResponseDto.toDto(nicknameService.getRandomNickname());
    }

    @Override
    public void signUp(SignUpRequestDto requestDto, MultipartFile profileImage) {
        signUpService.signUp(requestDto, profileImage);
    }

    @Override
    public String resetPassword(ResetPasswordRequestDto requestDto) {
        return resetPasswordService.resetPassword(requestDto);
    }

    @Override
    public CheckEmailResponseDto checkEmail(CheckEmailRequestDto requestDto) {
        return emailVerificationService.checkEmail(requestDto);
    }
}
