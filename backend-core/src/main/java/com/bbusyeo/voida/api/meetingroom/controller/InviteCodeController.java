package com.bbusyeo.voida.api.meetingroom.controller;

import com.bbusyeo.voida.api.meetingroom.dto.InviteCodeRequestDto;
import com.bbusyeo.voida.api.meetingroom.dto.InviteCodeResponseDto;
import com.bbusyeo.voida.api.meetingroom.service.InviteCodeService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/meeting-rooms")
public class InviteCodeController {

    private final InviteCodeService inviteCodeService;

    // 초대 코드 생성
    @PostMapping("/{meetingRoomId}/invite-code")
    public BaseResponse<InviteCodeResponseDto> createInviteCode(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long meetingRoomId) {

        String memberUuid = ((UserDetailsDto) userDetails).getMemberUuid();
        InviteCodeResponseDto responseDto = inviteCodeService.createInviteCode(memberUuid, meetingRoomId);
        return new BaseResponse<>(responseDto);
    }

    // 초대 코드 조회
    @GetMapping("/{meetingRoomId}/invite-code")
    public BaseResponse<InviteCodeResponseDto> getInviteCode(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long meetingRoomId) {

        String memberUuid = ((UserDetailsDto) userDetails).getMemberUuid();
        InviteCodeResponseDto responseDto = inviteCodeService.getInviteCode(memberUuid, meetingRoomId);
        return new BaseResponse<>(responseDto);
    }

    // 초대 코드 검증 및 입장
    @PostMapping("/verify-invite-code")
    public BaseResponse<Void> verifyInviteCodeAndJoin(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody InviteCodeRequestDto requestDto) {

        String memberUuid = ((UserDetailsDto) userDetails).getMemberUuid();
        inviteCodeService.verifyInviteCodeAndJoin(memberUuid, requestDto.getInviteCode());
        return new BaseResponse<>();
    }
}
