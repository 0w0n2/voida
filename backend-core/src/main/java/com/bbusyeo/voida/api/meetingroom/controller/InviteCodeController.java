package com.bbusyeo.voida.api.meetingroom.controller;

import com.bbusyeo.voida.api.meetingroom.dto.InviteCodeResponseDto;
import com.bbusyeo.voida.api.meetingroom.service.InviteCodeService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/meeting-rooms")
public class InviteCodeController {

    private final InviteCodeService inviteCodeService;

    @PostMapping("/{meetingRoomId}/invite-code")
    public BaseResponse<InviteCodeResponseDto> createInviteCode(@PathVariable Long meetingRoomId) {
        String inviteCode = inviteCodeService.createInviteCode(meetingRoomId);

        InviteCodeResponseDto responseDto = new InviteCodeResponseDto(inviteCode);

        return new BaseResponse<>(responseDto);
    }
}
