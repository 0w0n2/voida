package com.bbusyeo.voida.api.member.controller;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.dto.MeResponseInfoDto;
import com.bbusyeo.voida.api.member.dto.UpdateMeProfileRequestDto;
import com.bbusyeo.voida.api.member.service.MyPageService;
import com.bbusyeo.voida.global.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 마이페이지 회원 정보 관련 컨트롤러
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
    public BaseResponse<MeResponseInfoDto> getProfile(
            @AuthenticationPrincipal(expression = "member") Member member) {
        return new BaseResponse<>(MeResponseInfoDto.toMeResponseDto(myPageService.getMeProfile(member)));
    }

    @GetMapping("/setting")
    public BaseResponse<MeResponseInfoDto> getSetting(
            @AuthenticationPrincipal(expression = "member") Member member) {
        return new BaseResponse<>(MeResponseInfoDto.toMeResponseDto(myPageService.getMeSetting(member.getId())));
    }

    @GetMapping("/quick-slots")
    public BaseResponse<MeResponseInfoDto> getQuickSlots(
            @AuthenticationPrincipal(expression = "member") Member member) {
        // TODO-MEMBER: 퀵슬롯 음성 TTS 구현 후 수정 필요 (TTS 음성 생성 로직 없음)
        return new BaseResponse<>(MeResponseInfoDto.toMeResponseDto(myPageService.getMeQuickSlots(member.getId())));
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponse<Void> updateProfile(
            @RequestPart UpdateMeProfileRequestDto requestDt,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @AuthenticationPrincipal(expression = "member") Member member) {
        myPageService.updateProfile(requestDt, profileImage, member.getId());
        return new BaseResponse<>();
    }
}
