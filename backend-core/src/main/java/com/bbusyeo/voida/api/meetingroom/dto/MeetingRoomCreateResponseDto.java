package com.bbusyeo.voida.api.meetingroom.dto;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingRoomCreateResponseDto {

    private final Long meetingRoomId;
    private final String title;
    private final String category;
    private final String thumbnailImageUrl;
    private final Integer memberCount;

    public static MeetingRoomCreateResponseDto from(MeetingRoom meetingRoom) {
        return new MeetingRoomCreateResponseDto(
                meetingRoom.getId(),
                meetingRoom.getTitle(),
                meetingRoom.getCategoryName(),
                meetingRoom.getThumbnailImageUrl(),
                meetingRoom.getMemberCount()
        );
    }
}
