package com.bbusyeo.voida.api.meetingroom.repository;

import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoomId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
// member_meeting_room 중계 테이블에 대한 DB 작업 처리하는 repository, host / participant 조회
public interface MemberMeetingRoomRepository extends JpaRepository<MemberMeetingRoom, MemberMeetingRoomId> {
    Optional<MemberMeetingRoom> findByMemberIdAndMeetingRoomId(Long memberId, Long meetingRoomId);
}
