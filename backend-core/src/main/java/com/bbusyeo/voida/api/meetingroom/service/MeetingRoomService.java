package com.bbusyeo.voida.api.meetingroom.service;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomCreateRequestDto;
import com.bbusyeo.voida.api.meetingroom.repository.MeetingRoomRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingRoomService {

    private final MeetingRoomRepository meetingRoomRepository;

    @Transactional
    // 대기실 생성
    public MeetingRoom create(MeetingRoomCreateRequestDto request) {
        // 추후 JWT에서 member 정보 받아와서 연관관계 설정 필요
        MeetingRoom meetingRoom = request.toEntity();
        return meetingRoomRepository.save(meetingRoom);
    }

    // 대기실 기본정보 조회
    public MeetingRoom findById(Long meetingRoomId) {
        return meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NOT_FOUND_MEETING_ROOM));
    }
}
