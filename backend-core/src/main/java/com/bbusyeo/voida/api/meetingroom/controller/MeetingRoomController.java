package com.bbusyeo.voida.api.meetingroom.controller;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.dto.*;
import com.bbusyeo.voida.api.meetingroom.service.MeetingRoomService;
import com.bbusyeo.voida.global.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/meeting-rooms")
public class MeetingRoomController {

    private final MeetingRoomService meetingRoomService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // 대기실 생성
    public BaseResponse<MeetingRoomCreateResponseDto> create(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestPart(value = "thumbnailImage", required = false) MultipartFile thumbnailImage) {

        MeetingRoomCreateRequestDto request = new MeetingRoomCreateRequestDto(title, category);
        // Todo: memberId는 혜원 작업 완료 후, 인증(JWT 토큰)에서 가져와야함
        Long memberId = 1L;
        MeetingRoom newMeetingRoom = meetingRoomService.create(memberId, request, thumbnailImage);
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
        @PathVariable Long meetingRoomId,
        @RequestParam(value = "title", required = false) String title,
        @RequestParam(value = "category", required = false) String category,
        @RequestPart(value = "thumbnailImage", required = false)MultipartFile thumbnailImage) {

        MeetingRoomUpdateRequestDto request = new MeetingRoomUpdateRequestDto(title, category);
        // Todo: memberId는 혜원 작업 완료 후, 인증(JWT 토큰)에서 가져와야함
        Long memberId = 1L; // 임시
        MeetingRoom updateMeetingRoom = meetingRoomService.update(memberId, meetingRoomId, request, thumbnailImage);
        MeetingRoomUpdateResponseDto response = MeetingRoomUpdateResponseDto.from(updateMeetingRoom);
        return new BaseResponse<>(response);
    }

    @DeleteMapping("{meetingRoomId}")
    // 대기실 삭제
    public BaseResponse<Void> delete(@PathVariable Long meetingRoomId) {
        // Todo: memberId는 혜원 작업 완료 후, 인증(JWT 토큰)에서 가져와야함
        Long memberId = 1L;
        meetingRoomService.delete(memberId, meetingRoomId);
        return new BaseResponse<>();
    }
}
