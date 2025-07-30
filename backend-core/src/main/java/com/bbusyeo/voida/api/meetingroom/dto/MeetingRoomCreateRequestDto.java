package com.bbusyeo.voida.api.meetingroom.dto;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MeetingRoomCreateRequestDto {

    private String title;
    private String category;
//    private String thumbnailImageUrl;

//    public MeetingRoom toEntity() {
//        return MeetingRoom.builder()
//                .title(title)
//                .categoryName(category)
////                .thumbnailImageUrl(thumbnailImageUrl)
//                .memberCount(1) // 방 생성 시 참여 인원 1명 (방장)
//                .build();
//    }
}
