package com.bbusyeo.voida.api.meetingroom.dto;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingRoomInfoResponseDto {

    private final String title;
    private final String category;
    private final String thumbnailImageUrl;

    public static MeetingRoomInfoResponseDto from(MeetingRoom meetingRoom) {
        return new MeetingRoomInfoResponseDto(
                meetingRoom.getTitle(),
                meetingRoom.getCategoryName(),
                meetingRoom.getThumbnailImageUrl()
        );
    }
}
