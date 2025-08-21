package com.bbusyeo.voida.api.liveroom.service;

import com.bbusyeo.voida.api.liveroom.dto.out.SessionResponseDto;
import com.bbusyeo.voida.api.liveroom.dto.out.TokenResponseDto;

public interface LiveRoomService {

    SessionResponseDto createOrGetSession(String memberUuid, Long meetingRoomId);

    TokenResponseDto createToken(String memberUuid, Long meetingRoomId);

    void leaveSession(String memberUuid, Long meetingRoomId);

    void checkLocked(Long meetingRoomId);

}
