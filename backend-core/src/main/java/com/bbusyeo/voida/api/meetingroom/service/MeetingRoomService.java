package com.bbusyeo.voida.api.meetingroom.service;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomCreateRequestDto;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomUpdateRequestDto;
import com.bbusyeo.voida.api.meetingroom.repository.MeetingRoomRepository;
import com.bbusyeo.voida.api.meetingroom.repository.MemberMeetingRoomRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MeetingRoomService {

    private final MeetingRoomRepository meetingRoomRepository;
    private final MemberMeetingRoomRepository memberMeetingRoomRepository;
    private final MemberRepository memberRepository;

    // 대기실 생성
    public MeetingRoom create(Long memberId, MeetingRoomCreateRequestDto request) {

        // 추후 JWT에서 member 정보 받아와서 연관관계 설정 필요
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.ILLEGAL_ARGUMENT));

        // 요청 DTO를 MeetingRoom 엔티티로 변환
        MeetingRoom meetingRoom = request.toEntity();

        // MeetingRoom 저장
        MeetingRoom saveMeetingRoom = meetingRoomRepository.save(meetingRoom);

        // 생성자 = Host 설정하는 MemberMeetingRoom 객체 생성
        MemberMeetingRoom hostLink = MemberMeetingRoom.builder()
                .member(member)
                .meetingRoom(saveMeetingRoom)
                .state(MemberMeetingRoomState.HOST)
                .build();

        // MemberMeetingRoom에 관계 저장
        memberMeetingRoomRepository.save(hostLink);
        return saveMeetingRoom;
    }

    @Transactional(readOnly = true)
    // 대기실 기본정보 조회
    public MeetingRoom findById(Long meetingRoomId) {
        return meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NOT_FOUND_MEETING_ROOM));
    }

    // 방장 권한 확인 메서드
    private void checkHostAuthority(Long memberId, Long meetingRoomId) {
        // memberId는 혜원 작업 완료 후, 인증(JWT 토큰)에서 가져와야함
        Member member = memberRepository.findById(memberId)
                // 시스템에 존재하는 유저가 아닐때, 임시로 400 에러 => 추후 NOT_FOUND_MEMBER response로 바꿔야함
                .orElseThrow(() -> new BaseException(BaseResponseStatus.ILLEGAL_ARGUMENT));
        memberMeetingRoomRepository.findByMemberAndMeetingRoomId(member, meetingRoomId)
                .filter(memberMeetingRoom -> memberMeetingRoom.getState() == MemberMeetingRoomState.HOST)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.FORBIDDEN_ACCESS));
    }

    // 방 기본 정보 수정
    public MeetingRoom update(Long memberId, Long meetingRoomId, MeetingRoomUpdateRequestDto requestDto) {
        // 방장 권한 확인하기
        checkHostAuthority(memberId, meetingRoomId);
        MeetingRoom meetingRoom = findById(meetingRoomId);
        meetingRoom.update(requestDto.getTitle(), requestDto.getCategory(), requestDto.getThumbnailImageUrl());
        return meetingRoom;
    }

    // 대기실 삭제
    public void delete(Long memberId, Long meetingRoomId) {
        // 방장 권한 확인
        checkHostAuthority(memberId, meetingRoomId);
        // MeetingRoom 존재 확인
        MeetingRoom meetingRoom = findById(meetingRoomId);
        // 연관된 MemberMeetingRoom 데이터 삭제
        memberMeetingRoomRepository.deleteByMeetingRoom_Id(meetingRoom.getId());
        // 모든 자식 데이터 삭제된 후, MeetingRoom 삭제
        meetingRoomRepository.delete(meetingRoom);
    }
}
