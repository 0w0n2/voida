package com.bbusyeo.voida.api.auth.controller;

import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.EmailCodeRequestDto;
import com.bbusyeo.voida.api.auth.dto.EmailCodeResponseDto;
import com.bbusyeo.voida.api.auth.dto.SignInRequestDto;
import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.api.auth.service.AuthService;
import com.bbusyeo.voida.global.mail.service.MailService;
import com.bbusyeo.voida.global.mail.util.MailType;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MailService mailService;

    // TODO-NEWSECU: 로그인성공/실패 handler 응답 템플릿 BaseResponse로 맞추라 + isNewbie 내려줘야 함
    @PostMapping("/sign-in")
    public BaseResponse<SignInResponseDto> signIn(@Valid @RequestBody SignInRequestDto signInRequestDto, HttpServletResponse response) {
        return new BaseResponse<>(authService.signIn(signInRequestDto, response));
    }

    @PostMapping("/refresh")
    public BaseResponse<Void> refresh(@CookieValue(value = "refreshToken") String refreshToken, HttpServletRequest request, HttpServletResponse response) {
        authService.refreshAccessToken(refreshToken, response);
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }

    @PostMapping("/sign-out")
    public BaseResponse<Void> signOut(HttpServletRequest request, HttpServletResponse response) {
        authService.signOut(request, response);
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }

    @PostMapping("/email-code")
    public BaseResponse<EmailCodeResponseDto> emailCode(@RequestBody EmailCodeRequestDto emailCodeRequestDto) {
        VerificationCode verificationCode = authService.generateVerificationCode(emailCodeRequestDto.getEmail());

        mailService.sendHtmlMail(emailCodeRequestDto.getEmail(),
                MailType.SIGN_UP_EMAIL_VERIFICATION,
                Map.of("code", verificationCode.getCode()));

        return new BaseResponse<>(EmailCodeResponseDto.toDto(verificationCode));
    }
}
