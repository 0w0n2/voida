package com.bbusyeo.voida.api.meetingroom.controller;

import com.bbusyeo.voida.api.meetingroom.dto.InviteCodeRequestDto;
import com.bbusyeo.voida.api.meetingroom.dto.InviteCodeResponseDto;
import com.bbusyeo.voida.api.meetingroom.service.InviteCodeService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/meeting-rooms")
public class InviteCodeController {

    private final InviteCodeService inviteCodeService;

    @PostMapping("/{meetingRoomId}/invite-code")
    public BaseResponse<InviteCodeResponseDto> createInviteCode(@PathVariable Long meetingRoomId) {
        InviteCodeResponseDto responseDto = inviteCodeService.createInviteCode(meetingRoomId);
        return new BaseResponse<>(responseDto);
    }

    @GetMapping("/{meetingRoomId}/invite-code")
    public BaseResponse<InviteCodeResponseDto> getInviteCode(@PathVariable Long meetingRoomId) {
        // todo: JWT 토큰에서 memberId 추출
        Long memberId = 1L;
        InviteCodeResponseDto responseDto = inviteCodeService.getInviteCode(memberId, meetingRoomId);
        return new BaseResponse<>(responseDto);
    }

    @PostMapping("/verify-invite-code")
    public BaseResponse<Void> verifyInviteCodeAndJoin(@RequestBody InviteCodeRequestDto requestDto) {
        // todo: JWT 토큰에서 memberId 추출
        Long memberId = 2L;
        inviteCodeService.verifyInviteCodeAndJoin(memberId, requestDto.getInviteCode());
        return new BaseResponse<>();
    }
}
