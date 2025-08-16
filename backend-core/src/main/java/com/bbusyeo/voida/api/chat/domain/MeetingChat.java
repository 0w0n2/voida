package com.bbusyeo.voida.api.chat.domain;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "meeting_chat")
public class MeetingChat {

    @Id
    private String id;
    private Long meetingRoomId;
    private String senderUuid;
    private String content;
    private LocalDateTime sendedAt;
}
