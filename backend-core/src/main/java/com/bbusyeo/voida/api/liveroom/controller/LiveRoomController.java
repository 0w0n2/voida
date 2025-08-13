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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/v1/live-rooms")
@Tag(name = "Live Room")
@RequiredArgsConstructor
@RestController
public class LiveRoomController {

    private final LiveRoomService liveRoomService;

    @Operation(summary = "OpenVidu 세션 생성 및 조회 API",
            description = "방이 `IDLE` 상태일 때, 새로운 라이브 세션을 생성합니다.")
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

}
