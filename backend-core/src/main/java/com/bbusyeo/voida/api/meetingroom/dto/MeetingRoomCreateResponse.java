package com.bbusyeo.voida.api.meetingroom.dto;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingRoomCreateResponse {

    private final Long meetingRoomId;
    private final String title;
    private final String category;
    private final String thumbnailImageUrl;
    private final Integer memberCount;

    public static MeetingRoomCreateResponse from(MeetingRoom meetingRoom) {
        return new MeetingRoomCreateResponse(
                meetingRoom.getId(),
                meetingRoom.getTitle(),
                meetingRoom.getCategoryName(),
                meetingRoom.getThumbnailImageUrl(),
                meetingRoom.getMemberCount()
        );
    }
}
