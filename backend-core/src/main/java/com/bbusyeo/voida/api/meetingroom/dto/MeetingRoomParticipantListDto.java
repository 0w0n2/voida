package com.bbusyeo.voida.api.meetingroom.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class MeetingRoomParticipantListDto {

    private int memberCount;
    private List<ParticipantInfoDto> participants;

    public static MeetingRoomParticipantListDto of(List<ParticipantInfoDto> participants) {
        return new MeetingRoomParticipantListDto(
                participants.size(),
                participants
        );
    }
}
