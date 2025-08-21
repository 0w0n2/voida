package com.bbusyeo.voida.api.admin.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
@Builder
public class GetLiveRoomWhitelistsResponseDto {

    public List<LiveRoomWhitelistDto> requestDto;

    public static GetLiveRoomWhitelistsResponseDto toDto(List<LiveRoomWhitelistDto> liveRoomWhitelistDtos) {
        return GetLiveRoomWhitelistsResponseDto.builder()
                .requestDto(liveRoomWhitelistDtos)
                .build();
    }

}
