package com.bbusyeo.voida.api.meetingroom.repository;

import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.member.domain.Member;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * member_meeting_room 중계 테이블에 대한 DB 작업 처리하는 repository, host / participant 조회
  */
@Repository
public interface MemberMeetingRoomRepository extends JpaRepository<MemberMeetingRoom, Long> {
    // Member 객체와 meetingRoomId로 조회하기
    Optional<MemberMeetingRoom> findByMemberUuidAndMeetingRoomId(String memberUuid, Long meetingRoomId);

    // JPA 규칙, 언더바로 필드 구분, JPA의 삭제 로직
    void deleteByMeetingRoom_Id(Long meetingRoomId);

    // 대기실에 들어가있는 회원 목록 JPA로 조회
    List<MemberMeetingRoom> findByMeetingRoomId(Long meetingRoomId);

    List<MemberMeetingRoom> findByMemberUuid(String memberUuid);

    void deleteMemberMeetingRoomsByMemberUuid(String memberUuid);
}
