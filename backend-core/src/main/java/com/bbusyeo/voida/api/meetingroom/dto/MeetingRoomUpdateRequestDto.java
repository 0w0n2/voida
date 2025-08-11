package com.bbusyeo.voida.api.meetingroom.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MeetingRoomUpdateRequestDto {
    private String title;
    private String category;
}
