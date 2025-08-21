package com.bbusyeo.voida.api.admin.service;

import com.bbusyeo.voida.api.admin.dto.LiveRoomWhitelistDto;

import java.util.List;

public interface AdminLiveRoomService {

    void addLiveRoomWhitelist(Long meetingRoomId);

    void removeLiveRoomWhitelist(Long meetingRoomId);

    List<LiveRoomWhitelistDto> getAllLiveRoomWhitelist();

    void clearAllWhiteLists();

}
