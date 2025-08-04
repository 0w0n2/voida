package com.bbusyeo.voida.api.meetingroom.controller;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.dto.*;
import com.bbusyeo.voida.api.meetingroom.service.MeetingRoomService;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/meeting-rooms")
public class MeetingRoomController {

    private final MeetingRoomService meetingRoomService;

    // 대기실 생성
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponse<MeetingRoomCreateResponseDto> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestPart(value = "thumbnailImage", required = false) MultipartFile thumbnailImage) {

        String memberUuid = ((UserDetailsDto) userDetails).getMemberUuid();

        MeetingRoomCreateRequestDto request = new MeetingRoomCreateRequestDto(title, category);
        MeetingRoom newMeetingRoom = meetingRoomService.create(memberUuid, request, thumbnailImage);
        MeetingRoomCreateResponseDto response = MeetingRoomCreateResponseDto.from(newMeetingRoom);
        return new BaseResponse<>(response);
    }

    @GetMapping("/{meetingRoomId}")
    // 대기실 기본 정보 조회
    public BaseResponse<MeetingRoomInfoResponseDto> findById(@PathVariable Long meetingRoomId) {
        // 서비스에 ID로 방을 찾아달라고 요청
        MeetingRoom meetingRoom = meetingRoomService.findById(meetingRoomId);
        // 찾은 방 정보를 응답용 DTO로 변환
        MeetingRoomInfoResponseDto response = MeetingRoomInfoResponseDto.from(meetingRoom);
        return new BaseResponse<>(response);
    }

    @PutMapping(value = "/{meetingRoomId}/settings", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // 대기실 기본 정보 수정
    public BaseResponse<MeetingRoomUpdateResponseDto> update(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long meetingRoomId,
        @RequestParam(value = "title", required = false) String title,
        @RequestParam(value = "category", required = false) String category,
        @RequestPart(value = "thumbnailImage", required = false)MultipartFile thumbnailImage) {

        String memberUuid = ((UserDetailsDto) userDetails).getMemberUuid();

        MeetingRoomUpdateRequestDto request = new MeetingRoomUpdateRequestDto(title, category);
        MeetingRoom updateMeetingRoom = meetingRoomService.update(memberUuid, meetingRoomId, request, thumbnailImage);
        MeetingRoomUpdateResponseDto response = MeetingRoomUpdateResponseDto.from(updateMeetingRoom);
        return new BaseResponse<>(response);
    }

    @DeleteMapping("{meetingRoomId}")
    // 대기실 삭제
    public BaseResponse<Void> delete(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long meetingRoomId) {

        String memberUuid = ((UserDetailsDto) userDetails).getMemberUuid();
        meetingRoomService.delete(memberUuid, meetingRoomId);
        return new BaseResponse<>();
    }
}
