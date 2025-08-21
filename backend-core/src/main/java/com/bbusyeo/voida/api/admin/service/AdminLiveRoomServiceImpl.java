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
        redisDao.addSetValue(AuthLiveRoomValue.LIVE_ROOM_WHITELIST_KEY, meetingRoomId);
    }

    @Override
    public void removeLiveRoomWhitelist(Long meetingRoomId) {
        redisDao.deleteSetValue(AuthLiveRoomValue.LIVE_ROOM_WHITELIST_KEY, meetingRoomId);
    }

    @Override
    public List<LiveRoomWhitelistDto> getAllLiveRoomWhitelist() {
        Set<Object> values = redisDao.getSetValue(AuthLiveRoomValue.LIVE_ROOM_WHITELIST_KEY);

        return Optional.ofNullable(values)
                .orElse(Collections.emptySet())
                .stream()
                .filter(Number.class::isInstance)
                .map(obj -> ((Number) obj).longValue())
                .map(LiveRoomWhitelistDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void clearAllWhiteLists() {
        redisDao.deleteValue(AuthLiveRoomValue.LIVE_ROOM_WHITELIST_KEY);
    }

}
