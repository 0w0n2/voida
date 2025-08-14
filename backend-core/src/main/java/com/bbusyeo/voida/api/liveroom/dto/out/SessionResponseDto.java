package com.bbusyeo.voida.api.liveroom.dto.out;

import com.bbusyeo.voida.api.liveroom.domain.model.Participant;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.global.support.ServerDataParser;
import io.openvidu.java.client.Session;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class SessionResponseDto {

    private String ovSessionId;
    private Integer participantCount;
    private List<Participant> participants;

    @Builder
    public SessionResponseDto(String ovSessionId, Integer participantCount,
        List<Participant> participants) {
        this.ovSessionId = ovSessionId;
        this.participantCount = participantCount;
        this.participants = participants;
    }

    public static SessionResponseDto from(Session session) {
        List<Participant> activeParticipants = session == null ? List.of() :
            session.getActiveConnections().stream()
                .map(c -> {
                    var sd = ServerDataParser.parse(c.getServerData());

                    return Participant.builder()
                        .connectionId(c.getConnectionId())
                        .nickname(ServerDataParser.getText(sd, "nickname"))
                        .profileImageUrl(ServerDataParser.getText(sd, "profileImageUrl"))
                        .state(ServerDataParser.getEnum(sd, "state", MemberMeetingRoomState.class))
                        .lipTalkMode(ServerDataParser.getBoolean(sd, "lipTalkMode", false))
                        .build();
                }).toList();

        return SessionResponseDto.builder()
            .ovSessionId(session != null ? session.getSessionId() : null)
            .participants(activeParticipants)
            .participantCount(activeParticipants.size())
            .build();
    }

}
