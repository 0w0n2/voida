package com.bbusyeo.voida.api.admin.service;

import com.bbusyeo.voida.api.admin.constant.AuthLiveRoomValue;
import com.bbusyeo.voida.api.admin.dto.LiveRoomWhitelistDto;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminLiveRoomServiceImpl implements AdminLiveRoomService {

    private final RedisDao redisDao;

    @Override
    public void addLiveRoomWhitelist(Long meetingRoomId) {
        String key = AuthLiveRoomValue.LIVE_ROOM_WHITELIST_KEY + meetingRoomId;
        redisDao.addSetValue(key, meetingRoomId);
    }

    @Override
    public void removeLiveRoomWhitelist(Long meetingRoomId) {
        String key = AuthLiveRoomValue.LIVE_ROOM_WHITELIST_KEY + meetingRoomId;
        redisDao.deleteSetValue(key, meetingRoomId);
    }

    @Override
    public List<LiveRoomWhitelistDto> getAllLiveRoomWhitelist() {
        Set<Object> values = redisDao.getSetValue(AuthLiveRoomValue.LIVE_ROOM_WHITELIST_KEY);

        return Optional.ofNullable(values)
                .orElse(Collections.emptySet())
                .stream()
                .filter(Long.class::isInstance)
                .map(Long.class::cast)
                .map(LiveRoomWhitelistDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void clearAllWhiteLists() {
        redisDao.deleteValue(AuthLiveRoomValue.LIVE_ROOM_WHITELIST_KEY);
    }

}
