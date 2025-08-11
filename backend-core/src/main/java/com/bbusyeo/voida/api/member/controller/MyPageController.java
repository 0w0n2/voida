package com.bbusyeo.voida.api.member.controller;

import com.bbusyeo.voida.api.auth.service.TokenAuthService;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.dto.*;
import com.bbusyeo.voida.api.member.service.DeleteAccountService;
import com.bbusyeo.voida.api.member.service.MyPageService;
import com.bbusyeo.voida.api.member.service.QuickSlotService;
import com.bbusyeo.voida.global.response.BaseResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 마이페이지 회원 정보 관련 컨트롤러
 */
@RestController
@RequestMapping("/v1/members/me")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;
    private final DeleteAccountService deleteAccountService;
    private final TokenAuthService tokenAuthService;
    private final QuickSlotService quickSlotService;

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
        return new BaseResponse<>(MeResponseInfoDto.toMeResponseDto(quickSlotService.getMeQuickSlots(member.getId())));
    }

    @GetMapping("/social-accounts")
    public BaseResponse<MeSocialAccountsResponseDto> getSocialAccounts(@AuthenticationPrincipal(expression = "member") Member member) {
        return new BaseResponse<>(MeSocialAccountsResponseDto.toDto(myPageService.getSocialAccounts(member.getId())));
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponse<Void> updateProfile(
            @RequestPart UpdateMeProfileRequestDto requestDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @AuthenticationPrincipal(expression = "member") Member member) {
        myPageService.updateProfile(requestDto, profileImage, member.getId());
        return new BaseResponse<>();
    }

    @PostMapping("/verify-password")
    public BaseResponse<VerifyPasswordResponseDto> verifyPassword(
            @Valid @RequestBody VerifyPasswordRequestDto requestDto,
            @AuthenticationPrincipal(expression = "member") Member member
    ){
        return new BaseResponse<>(VerifyPasswordResponseDto.toDto(myPageService.verifyPassword(member, requestDto.getPassword())));
    }

    @PutMapping("/password")
    public BaseResponse<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequestDto requestDto,
            @AuthenticationPrincipal(expression = "member") Member member
    ){
        myPageService.changePassword(member.getId(), requestDto);
        return new BaseResponse<>();
    }

    @PutMapping("/lip-talk-mode")
    public BaseResponse<Void> changeLipTalkMode(
            @Valid @RequestBody ChangeLipTalkRequestMode requestDto,
            @AuthenticationPrincipal(expression = "member") Member member
    ) {
        myPageService.changeLipTalkMode(member.getId(), requestDto);
        return new BaseResponse<>();
    }

    @PutMapping("/overlay")
    public BaseResponse<Void> changeOverlay(
            @Valid @RequestBody ChangeOverlayRequestDto requestDto,
            @AuthenticationPrincipal(expression = "member") Member member
    ) {
        myPageService.changeOverlay(member.getId(), requestDto);
        return new BaseResponse<>();
    }

    @PutMapping("/quick-slots")
    public BaseResponse<Void> changeQuickSlots(
            @Valid @RequestBody ChangeQuickSlotsRequestDto requestDto,
            @AuthenticationPrincipal(expression = "member") Member member
    ) {
        quickSlotService.changeQuickSlots(member.getId(), requestDto);
        return new BaseResponse<>();
    }

    @DeleteMapping
    public BaseResponse<Void> deleteMember(
            HttpServletRequest request, HttpServletResponse response,
            @AuthenticationPrincipal(expression = "member") Member member
    ) {
        deleteAccountService.deleteAccount(member.getId()); // 회원 삭제
        tokenAuthService.signOut(request, response); // 로그아웃 처리
        return new BaseResponse<>();
    }

}
