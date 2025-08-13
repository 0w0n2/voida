package com.bbusyeo.voida.api.liveroom.service;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.OPENVIDU_SERVER_ERROR;

import com.bbusyeo.voida.api.liveroom.dto.out.SessionResponseDto;
import com.bbusyeo.voida.global.exception.BaseException;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LiveRoomServiceImpl implements LiveRoomService {

    private final OpenVidu openVidu;

    @Override
    public SessionResponseDto createOrGetSession(String memberUuid, String meetingRoomId) {

        try {
            openVidu.fetch(); // 최신 상태 동기화
            Session session = openVidu.getActiveSession(meetingRoomId);

            if (session == null) {
                session = openVidu.createSession(SessionProperties
                    .fromJson(Map.of("customSessionId", meetingRoomId))
                    .build());
            }

            return SessionResponseDto.from(session);

        } catch (Exception e) {
            throw new BaseException(OPENVIDU_SERVER_ERROR);
        }
    }



}
