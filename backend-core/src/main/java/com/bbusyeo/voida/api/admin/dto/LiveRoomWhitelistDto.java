package com.bbusyeo.voida.api.admin.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class LiveRoomWhitelistDto {

    public Long meetingRoomId;

    public static LiveRoomWhitelistDto toDto(Long meetingRoomId) {
        return LiveRoomWhitelistDto.builder()
                .meetingRoomId(meetingRoomId)
                .build();
    }

}
