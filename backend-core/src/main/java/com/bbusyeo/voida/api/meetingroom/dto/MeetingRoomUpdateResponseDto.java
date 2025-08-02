package com.bbusyeo.voida.api.meetingroom.dto;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingRoomUpdateResponseDto {
    private final Long meetingRoomId;

    public static MeetingRoomUpdateResponseDto from(MeetingRoom meetingRoom) {
        return new MeetingRoomUpdateResponseDto(meetingRoom.getId());
    }
}
