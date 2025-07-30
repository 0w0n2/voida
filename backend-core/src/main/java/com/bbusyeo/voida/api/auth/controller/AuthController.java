package com.bbusyeo.voida.api.auth.controller;

import com.bbusyeo.voida.api.auth.dto.SignInRequestDto;
import com.bbusyeo.voida.api.auth.dto.SignInResponseDto;
import com.bbusyeo.voida.global.response.BaseResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/auth")
public class AuthController {
    @PostMapping("/sign-in")
    public void signIn(@RequestBody SignInRequestDto signInRequestDto) {

    }
}
