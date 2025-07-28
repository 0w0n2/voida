package com.bbusyeo.voida.api.meetingroom.controller;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomCreateRequest;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomCreateResponse;
import com.bbusyeo.voida.api.meetingroom.service.MeetingRoomService;
import com.bbusyeo.voida.global.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/meeting-rooms")
public class MeetingRoomController {

    private final MeetingRoomService meetingRoomService;

    @PostMapping
    public BaseResponse<MeetingRoomCreateResponse> create(@RequestBody MeetingRoomCreateRequest request) {
        // 추후 @AuthenticationPrincipal 등 사용해서 인증된 사용자 정보 불러오기
        MeetingRoom newMeetingRoom = meetingRoomService.create(request);
        MeetingRoomCreateResponse response = MeetingRoomCreateResponse.from(newMeetingRoom);
        return new BaseResponse<>(response);
    }
}
