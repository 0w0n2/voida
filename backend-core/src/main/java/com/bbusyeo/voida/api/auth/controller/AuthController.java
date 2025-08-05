package com.bbusyeo.voida.api.auth.controller;

import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.*;
import com.bbusyeo.voida.api.auth.service.AuthService;
import com.bbusyeo.voida.global.mail.service.MailService;
import com.bbusyeo.voida.global.mail.util.MailType;
import com.bbusyeo.voida.global.response.BaseResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    @Value("${voida.main-url}")
    private String mainUrl;

    private final AuthService authService;
    private final MailService mailService;

    @PostMapping("/sign-in")
    public BaseResponse<SignInResponseDto> signIn(@Valid @RequestBody SignInRequestDto requestDto, HttpServletResponse response) {
        return new BaseResponse<>(authService.signIn(requestDto, response));
    }

    @PostMapping("/reissue")
    public BaseResponse<Void> refresh(@CookieValue(value = "refreshToken") String refreshToken, HttpServletResponse response) {
        authService.refreshAccessToken(refreshToken, response);
        return new BaseResponse<>();
    }

    @PostMapping("/sign-out")
    public BaseResponse<Void> signOut(HttpServletRequest request, HttpServletResponse response) {
        authService.signOut(request, response);
        return new BaseResponse<>();
    }

    @PostMapping("/email-code")
    public BaseResponse<EmailCodeResponseDto> emailCode(@Valid @RequestBody EmailCodeRequestDto requestDto) {
        VerificationCode verificationCode = authService.generateVerificationCode(requestDto.getEmail());

        mailService.sendHtmlMail(requestDto.getEmail(),
                MailType.SIGN_UP_EMAIL_VERIFICATION,
                Map.of("mainUrl", mainUrl, "code", verificationCode.getCode()));

        return new BaseResponse<>(EmailCodeResponseDto.toDto(verificationCode));
    }

    @PostMapping("/verify-email")
    public BaseResponse<VerifyEmailResponseDto> verifyEmail(@Valid @RequestBody VerifyEmailRequestDto requestDto) {
        return new BaseResponse<>(authService.verifyEmailCode(requestDto));
    }

    @PostMapping("/check-nickname")
    public BaseResponse<CheckNicknameResponseDto> checkNickname(@Valid @RequestBody CheckNicknameRequestDto requestDto) {
        return new BaseResponse<>(authService.checkNickname(requestDto));
    }

    @GetMapping("/random-nickname")
    public BaseResponse<RandomNicknameResponseDto> randomNickname() {
        return new BaseResponse<>(authService.getRandomNickname());
    }

    @PostMapping(value = "/sign-up", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponse<Void> signUp(
            @Valid @RequestPart SignUpRequestDto requestDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        authService.signUp(requestDto, profileImage);
        return new BaseResponse<>();
    }

    @PostMapping("/reset-password")
    public BaseResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequestDto requestDto) {
        // TODO-AUTH: 비밀번호 재생성 플로우에 대해 담당 프론트 팀원과 논의 후 수정이 필요해보임, 이메일 코드 인증 후 발급하도록 해야할 듯
        String tempPassword = authService.resetPassword(requestDto);
        mailService.sendHtmlMail(requestDto.getEmail(),
                MailType.PASSWORD_RESET,
                Map.of("mainUrl", mainUrl, "tempPassword", tempPassword));
        return new BaseResponse<>();
    }

    @PostMapping("/check-email")
    public BaseResponse<CheckEmailResponseDto> checkNickname(@Valid @RequestBody CheckEmailRequestDto requestDto) {
        return new BaseResponse<>(authService.checkEmail(requestDto));
    }
}
