package com.bbusyeo.voida.api.meetingroom.dto;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MyMeetingRoomResponseDto {

    private Long meetingRoomId;
    private String title;
    private String categoryName;
    private String thumbnailImageUrl;
    private int memberCount;

    public static MyMeetingRoomResponseDto from(MeetingRoom meetingRoom) {
        return new MyMeetingRoomResponseDto(
                meetingRoom.getId(),
                meetingRoom.getTitle(),
                meetingRoom.getCategoryName(),
                meetingRoom.getThumbnailImageUrl(),
                meetingRoom.getMemberCount()
        );
    }
}