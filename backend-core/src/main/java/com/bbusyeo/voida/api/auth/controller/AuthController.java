package com.bbusyeo.voida.api.auth.controller;

import com.bbusyeo.voida.api.auth.dto.SignInRequestDto;
import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.api.auth.service.AuthService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // TODO-NEWSECU: 로그인성공/실패 handler 응답 템플릿 BaseResponse로 맞추라 + isNewbie 내려줘야 함
    @PostMapping("/sign-in")
    public BaseResponse<SignInResponseDto> signIn(@RequestBody SignInRequestDto signInRequestDto) {
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }

    @PostMapping("/refresh")
    public BaseResponse<Void> refresh(@CookieValue(value = "refreshToken") String refreshToken, HttpServletResponse response) {
        authService.refreshAccessToken(refreshToken, response);
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }

    @PostMapping("/sign-out")
    public BaseResponse<Void> signOut(HttpServletRequest request, HttpServletResponse response) {
        authService.signOut(request, response);
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }
}
