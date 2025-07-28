package com.bbusyeo.voida.api.meetingroom.controller;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomCreateRequestDto;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomCreateResponseDto;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomInfoResponseDto;
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
    public BaseResponse<MeetingRoomCreateResponseDto> create(@RequestBody MeetingRoomCreateRequestDto request) {
        // 추후 @AuthenticationPrincipal 등 사용해서 인증된 사용자 정보 불러오기
        MeetingRoom newMeetingRoom = meetingRoomService.create(request);
        MeetingRoomCreateResponseDto response = MeetingRoomCreateResponseDto.from(newMeetingRoom);
        return new BaseResponse<>(response);
    }

    @GetMapping("/{meetingRoomId}")
    public BaseResponse<MeetingRoomInfoResponseDto> findById(@PathVariable Long meetingRoomId) {
        // 서비스에 ID로 방을 찾아달라고 요청
        MeetingRoom meetingRoom = meetingRoomService.findById(meetingRoomId);
        // 찾은 방 정보를 응답용 DTO로 변환
        MeetingRoomInfoResponseDto response = MeetingRoomInfoResponseDto.from(meetingRoom);
        return new BaseResponse<>(response);
    }
}
