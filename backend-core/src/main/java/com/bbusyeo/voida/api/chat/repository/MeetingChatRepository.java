package com.bbusyeo.voida.api.chat.repository;

import com.bbusyeo.voida.api.chat.domain.MeetingChat;
import com.bbusyeo.voida.api.member.domain.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MeetingChatRepository extends MongoRepository<MeetingChat, String> {
    Page<MeetingChat> findByMeetingRoomIdOrderBySendedAtDesc(Long meetingRoomId, Pageable pageable);
}
