package com.bbusyeo.voida.api.liveroom.service;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.OPENVIDU_SERVER_ERROR;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.OPENVIDU_SESSION_NOT_FOUND;
import static io.openvidu.java.client.ConnectionProperties.DefaultValues.role;

import com.bbusyeo.voida.api.liveroom.domain.model.Participant;
import com.bbusyeo.voida.api.liveroom.dto.out.SessionResponseDto;
import com.bbusyeo.voida.api.liveroom.dto.out.TokenResponseDto;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.properties.OpenViduSessionProperties;
import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LiveRoomServiceImpl implements LiveRoomService {

    private final OpenVidu openVidu;
    private final OpenViduSessionProperties sessionProps;
    private final ParticipantService participantService;

    @Override
    public SessionResponseDto createOrGetSession(String memberUuid, Long meetingRoomId) {

        String customSessionId = generateCustomSessionId(meetingRoomId);

        try {
            openVidu.fetch(); // 최신 상태 동기화
            Session session = openVidu.getActiveSession(customSessionId);

            if (session == null) {
                session = openVidu.createSession(SessionProperties
                    .fromJson(Map.of("customSessionId", customSessionId))
                    .build());
            }

            return SessionResponseDto.from(session);

        } catch (Exception e) {
            throw new BaseException(OPENVIDU_SERVER_ERROR);
        }
    }

    @Override
    public TokenResponseDto createToken(String memberUuid, Long meetingRoomId) {

        String customSessionId = generateCustomSessionId(meetingRoomId);

        try {
            openVidu.fetch(); // 최신 상태 동기화

            Session session = openVidu.getActiveSession(customSessionId);
            if (session == null) {
                throw new BaseException(OPENVIDU_SESSION_NOT_FOUND);
            }

            Participant participant = participantService.loadParticipant(memberUuid, meetingRoomId);

            String serverData = String.format(
                "{\"memberUuid\":\"%s\",\"nickname\":\"%s\",\"profileImageUrl\":\"%s\","
                    + "\"state\":\"%s\",\"lipTalkMode\":%s}",
                memberUuid, participant.getNickname(),
                participant.getProfileImageUrl(),
                participant.getState(),
                participant.getLipTalkMode());

            ConnectionProperties props = ConnectionProperties
                .fromJson(Map.of(
                    "role", role.name(),
                    "data", serverData
                ))
                .build();

            Connection connection = session.createConnection(props);
            return new TokenResponseDto(connection.getToken());

        } catch (BaseException be) {
            throw be;
        } catch (OpenViduException oe) {
            throw new BaseException(OPENVIDU_SERVER_ERROR);
        } catch (Exception e) {
            throw new BaseException(OPENVIDU_SERVER_ERROR);
        }
    }

    private String generateCustomSessionId(Long meetingRoomId) {
        return sessionProps.getPrefix() + meetingRoomId;
    }

}
