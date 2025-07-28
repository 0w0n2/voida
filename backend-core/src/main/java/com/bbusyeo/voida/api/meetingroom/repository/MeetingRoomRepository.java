package com.bbusyeo.voida.api.meetingroom.repository;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {

}
