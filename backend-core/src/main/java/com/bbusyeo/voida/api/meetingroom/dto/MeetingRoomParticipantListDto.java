package com.bbusyeo.voida.api.meetingroom.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class MeetingRoomParticipantListDto {

    private int memberCount;
    private List<ParticipantInfoDto> participants; // Page -> List

    public static MeetingRoomParticipantListDto of(List<ParticipantInfoDto> participants) { // Page -> List
        return new MeetingRoomParticipantListDto(
                participants.size(), // getTotalElements() -> size()
                participants
        );
    }
}
