package com.bbusyeo.voida.api.meetingroom.controller;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.dto.*;
import com.bbusyeo.voida.api.meetingroom.service.MeetingRoomService;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.global.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/meeting-rooms")
public class MeetingRoomController {

    private final MeetingRoomService meetingRoomService;

    // 대기실 생성
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponse<MeetingRoomCreateResponseDto> create(
            @AuthenticationPrincipal(expression = "member") Member member,
            @RequestPart("requestDto") MeetingRoomCreateRequestDto requestDto,
            @RequestPart(value = "thumbnailImage", required = false) MultipartFile thumbnailImage) {

        MeetingRoom newMeetingRoom = meetingRoomService.create(member.getMemberUuid(), requestDto, thumbnailImage);
        MeetingRoomCreateResponseDto response = MeetingRoomCreateResponseDto.from(newMeetingRoom);
        return new BaseResponse<>(response);
    }

    // 대기실 기본 정보 조회
    @GetMapping("/{meetingRoomId}")
    public BaseResponse<MeetingRoomInfoResponseDto> findById(@PathVariable Long meetingRoomId) {
        MeetingRoom meetingRoom = meetingRoomService.findById(meetingRoomId);
        MeetingRoomInfoResponseDto response = MeetingRoomInfoResponseDto.from(meetingRoom);
        return new BaseResponse<>(response);
    }

    // 내가 참여중인 대기실 조회
    @GetMapping
    public BaseResponse<List<MyMeetingRoomResponseDto>> findMyMeetingRooms(
            @AuthenticationPrincipal(expression = "member") Member member) {
        List<MyMeetingRoomResponseDto> response = meetingRoomService.findMyMeetingRooms(member.getMemberUuid());
        return new BaseResponse<>(response);
    }

    // 대기실 기본 정보 수정
    @PutMapping(value = "/{meetingRoomId}/settings", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponse<MeetingRoomUpdateResponseDto> update(
            @AuthenticationPrincipal(expression = "member") Member member,
            @PathVariable Long meetingRoomId,
            @RequestPart("requestDto") MeetingRoomUpdateRequestDto requestDto,
            @RequestPart(value = "thumbnailImage", required = false) MultipartFile thumbnailImage) {

        MeetingRoom updateMeetingRoom = meetingRoomService.update(member.getMemberUuid(), meetingRoomId, requestDto, thumbnailImage);
        MeetingRoomUpdateResponseDto response = MeetingRoomUpdateResponseDto.from(updateMeetingRoom);
        return new BaseResponse<>(response);
    }

    // 대기실 참여자 정보 리스트 조회
    @GetMapping("/{meetingRoomId}/members")
    public BaseResponse<MeetingRoomParticipantListDto> getMeetingRoomMembers(
            @AuthenticationPrincipal(expression = "member") Member member,
            @PathVariable Long meetingRoomId) {

        MeetingRoomParticipantListDto response = meetingRoomService.getMeetingRoomMembers(member.getMemberUuid(), meetingRoomId);
        return new BaseResponse<>(response);
    }


    // 대기실 삭제
    @DeleteMapping("/{meetingRoomId}")
    public BaseResponse<Void> delete(
            @AuthenticationPrincipal(expression = "member") Member member,
            @PathVariable Long meetingRoomId) {

        meetingRoomService.delete(member.getMemberUuid(), meetingRoomId);
        return new BaseResponse<>();
    }

    // 방장 위임
    @PutMapping("/{meetingRoomId}/host")
    public BaseResponse<Void> changeHost(
            @AuthenticationPrincipal(expression = "member") Member member,
            @PathVariable Long meetingRoomId,
            @RequestBody HostChangeRequestDto request) {

        meetingRoomService.changeHost(member.getMemberUuid(), meetingRoomId, request.getMemberUuid());
        return new BaseResponse<>();
    }

    // member 추방
    @DeleteMapping("/{meetingRoomId}/members")
    public BaseResponse<Void> kickMember(
            @AuthenticationPrincipal(expression = "member") Member member,
            @PathVariable Long meetingRoomId,
            @RequestBody MemberKickRequestDto request) {

        meetingRoomService.kickMember(member.getMemberUuid(), meetingRoomId, request.getKickMemberUuid());
        return new BaseResponse<>();
    }

    // 대기실 나가기 (participant)
    @DeleteMapping("/{meetingRoomId}/participants")
    public BaseResponse<Void> leaveMeetingRoom(
            @AuthenticationPrincipal(expression = "member") Member member,
            @PathVariable Long meetingRoomId) {

        meetingRoomService.leaveMeetingRoom(member.getMemberUuid(), meetingRoomId);
        return new BaseResponse<>();
    }

}
