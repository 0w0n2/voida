package com.bbusyeo.voida.api.meetingroom.controller;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.dto.*;
import com.bbusyeo.voida.api.meetingroom.service.MeetingRoomService;
import com.bbusyeo.voida.global.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/meeting-rooms")
public class MeetingRoomController {

    private final MeetingRoomService meetingRoomService;

    @PostMapping
    // 대기실 생성
    public BaseResponse<MeetingRoomCreateResponseDto> create(@RequestBody MeetingRoomCreateRequestDto request) {
        // 추후 @AuthenticationPrincipal 등 사용해서 인증된 사용자 정보 불러오기, 임시 memberId 생성
        Long memberId = 1L;
        MeetingRoom newMeetingRoom = meetingRoomService.create(memberId, request);
        MeetingRoomCreateResponseDto response = MeetingRoomCreateResponseDto.from(newMeetingRoom);
        return new BaseResponse<>(response);
    }

    @GetMapping("/{meetingRoomId}")
    // 대기실 기본 정보 수정
    public BaseResponse<MeetingRoomInfoResponseDto> findById(@PathVariable Long meetingRoomId) {
        // 서비스에 ID로 방을 찾아달라고 요청
        MeetingRoom meetingRoom = meetingRoomService.findById(meetingRoomId);
        // 찾은 방 정보를 응답용 DTO로 변환
        MeetingRoomInfoResponseDto response = MeetingRoomInfoResponseDto.from(meetingRoom);
        return new BaseResponse<>(response);
    }

    @PutMapping("/{meetingRoomId}/settings")
    // 대기실 기본 정보 수정
    public BaseResponse<MeetingRoomUpdateResponseDto> update(
        @PathVariable Long meetingRoomId, @RequestBody MeetingRoomUpdateRequestDto request) {
        // memberId는 인증 기능 구현 완료 후, JWT 토큰에서 추출한 값으로 변경 예정
        Long memberId = 1L; // 임시
        MeetingRoom updateMeetingRoom = meetingRoomService.update(memberId, meetingRoomId, request);
        MeetingRoomUpdateResponseDto response = MeetingRoomUpdateResponseDto.from(updateMeetingRoom);
        return new BaseResponse<>(response);
    }

    @DeleteMapping("{meetingRoomId}")
    // 대기실 삭제
    public BaseResponse<Void> delete(@PathVariable Long meetingRoomId) {
        // memberId는 JWT 토큰에서 추출한 값으로 변경 예정
        Long memberId = 1L;
        meetingRoomService.delete(memberId, meetingRoomId);
        return new BaseResponse<>();
    }
}
