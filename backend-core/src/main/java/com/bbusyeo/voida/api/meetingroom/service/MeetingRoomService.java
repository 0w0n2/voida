package com.bbusyeo.voida.api.meetingroom.service;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomCreateRequest;
import com.bbusyeo.voida.api.meetingroom.repository.MeetingRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingRoomService {

    private final MeetingRoomRepository meetingRoomRepository;

    @Transactional
    public MeetingRoom create(MeetingRoomCreateRequest request) {
        // 추후 JWT에서 member 정보 받아와서 연관관계 설정 필요
        MeetingRoom meetingRoom = request.toEntity();
        return meetingRoomRepository.save(meetingRoom);
    }
}
