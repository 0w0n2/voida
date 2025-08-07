package com.bbusyeo.voida.api.member.controller;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.dto.MeResponseDto;
import com.bbusyeo.voida.api.member.service.MyPageService;
import com.bbusyeo.voida.global.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 회원 정보 관련
 */
@RestController
@RequestMapping("/v1/member/me")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;
    
    @PatchMapping("/newbie")
    public BaseResponse<Void> isNewbie(
            @AuthenticationPrincipal(expression = "member") Member member) {
        myPageService.updateIsNewbie(member.getId());
        return new BaseResponse<>();
    }

    @GetMapping("/profile")
    public BaseResponse<MeResponseDto> getProfile(
            @AuthenticationPrincipal(expression = "member") Member member) {
        return new BaseResponse<>(MeResponseDto.toMeResponseDto(myPageService.getMeProfile(member)));
    }

    @GetMapping("/setting")
    public BaseResponse<MeResponseDto> getSetting(
            @AuthenticationPrincipal(expression = "member") Member member) {
        return new BaseResponse<>(MeResponseDto.toMeResponseDto(myPageService.getMeSetting(member.getId())));
    }

    @GetMapping("/quick-slots")
    public BaseResponse<MeResponseDto> getQuickSlots(
            @AuthenticationPrincipal(expression = "member") Member member) {
        return new BaseResponse<>(MeResponseDto.toMeResponseDto(myPageService.getMeQuickSlots(member.getId())));
    }
}
