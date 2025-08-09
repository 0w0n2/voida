package com.bbusyeo.voida.api.chat.repository;

import com.bbusyeo.voida.api.chat.domain.MeetingChat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MeetingChatRepository extends MongoRepository<MeetingChat, String> {
    Page<MeetingChat> findByMeetingRoomIdOrderBySendedAtDesc(Long meetingRoomId, Pageable pageable);
}
