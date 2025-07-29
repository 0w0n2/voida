package com.bbusyeo.voida.api.meetingroom.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MeetingRoomUpdateRequestDto {
    private String title;
    private String category;
    private String thumbnailImageUrl;
}
