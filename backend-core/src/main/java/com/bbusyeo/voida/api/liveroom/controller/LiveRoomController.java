package com.bbusyeo.voida.api.liveroom.controller;

import com.bbusyeo.voida.api.liveroom.dto.out.SessionResponseDto;
import com.bbusyeo.voida.api.liveroom.dto.out.TokenResponseDto;
import com.bbusyeo.voida.api.liveroom.service.LiveRoomService;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.global.response.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/v1/live-rooms")
@Tag(name = "Live Room")
@RequiredArgsConstructor
@RestController
public class LiveRoomController {

    private final LiveRoomService liveRoomService;

    @Operation(summary = "OpenVidu 세션 생성 및 조회 API",
            description = "대기실과 매칭되는 세션이 없을 경우 새로운 라이브 세션을 생성하며, 세션 정보는 항상 반환합니다.")
    @PostMapping("/{meetingRoomId}/sessions")
    public BaseResponse<SessionResponseDto> createOrGetSession(
        @PathVariable Long meetingRoomId,
        @AuthenticationPrincipal(expression = "member") Member member) {

        return new BaseResponse<>(liveRoomService.createOrGetSession(
            member.getMemberUuid(), meetingRoomId));
    }

    @Operation(summary = "OpenVidu 토큰 발급 API", description = "세션 생성이 선행되어야 합니다.")
    @PostMapping("/{meetingRoomId}/tokens")
    public BaseResponse<TokenResponseDto> createToken(
        @PathVariable Long meetingRoomId,
        @AuthenticationPrincipal(expression = "member") Member member) {

        return new BaseResponse<>(liveRoomService.createToken(
            member.getMemberUuid(), meetingRoomId));
    }

    @Operation(summary = "OpenVidu 세션 퇴장 API",
            description = "요청 사용자를 세션에서 퇴장시키고, 마지막 1명이었다면 세션을 종료합니다.")
    @DeleteMapping("/{meetingRoomId}/sessions")
    public BaseResponse<Void> leaveSession(
            @PathVariable Long meetingRoomId,
            @AuthenticationPrincipal(expression = "member") Member member) {

        liveRoomService.leaveSession(member.getMemberUuid(), meetingRoomId);
        return new BaseResponse<>();
    }

}
