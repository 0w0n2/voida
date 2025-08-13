package com.bbusyeo.voida.api.liveroom.service;

import com.bbusyeo.voida.api.liveroom.dto.out.SessionResponseDto;

public interface LiveRoomService {

    SessionResponseDto createOrGetSession(String memberUuid, String meetingRoomId);

}
