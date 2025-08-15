package com.bbusyeo.voida.api.liveroom.service;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.OPENVIDU_SERVER_ERROR;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.OPENVIDU_SESSION_NOT_FOUND;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.OPENVIDU_TOKEN_NOT_FOUND;
import static io.openvidu.java.client.ConnectionProperties.DefaultValues.role;

import com.bbusyeo.voida.api.liveroom.domain.model.Participant;
import com.bbusyeo.voida.api.liveroom.dto.out.SessionResponseDto;
import com.bbusyeo.voida.api.liveroom.dto.out.TokenResponseDto;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.properties.OpenViduSessionProperties;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;

import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import com.bbusyeo.voida.global.support.ServerDataParser;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LiveRoomServiceImpl implements LiveRoomService {

    private final OpenVidu openVidu;
    private final OpenViduSessionProperties sessionProps;
    private final OpenViduUrlTransformer urlTransformer;

    private final ParticipantService participantService;

    @Override
    public SessionResponseDto createOrGetSession(String memberUuid, Long meetingRoomId) {

        final String customSessionId = generateCustomSessionId(meetingRoomId);

        try {
            openVidu.fetch(); // 최신 상태 동기화
            Session session = openVidu.getActiveSession(customSessionId);

            if (session == null) {
                session = openVidu.createSession(SessionProperties
                    .fromJson(Map.of("customSessionId", customSessionId))
                    .build());
            }

            return SessionResponseDto.from(session);

        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new BaseException(OPENVIDU_SERVER_ERROR);
        }
    }

    @Override
    public TokenResponseDto createToken(String memberUuid, Long meetingRoomId) {

        final String customSessionId = generateCustomSessionId(meetingRoomId);

        try {
            openVidu.fetch(); // 최신 상태 동기화

            Session session = openVidu.getActiveSession(customSessionId);
            if (session == null) throw new BaseException(OPENVIDU_SESSION_NOT_FOUND);

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
            return new TokenResponseDto(urlTransformer.transform(connection.getToken()));

        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new BaseException(OPENVIDU_SERVER_ERROR);
        }
    }

    @Override
    public void leaveSession(String memberUuid, Long meetingRoomId) {

        final String customSessionId = generateCustomSessionId(meetingRoomId);

        try {
            openVidu.fetch();

            Session session = openVidu.getActiveSession(customSessionId);
            if (session == null) throw new BaseException(OPENVIDU_SESSION_NOT_FOUND);

            Connection connection = session.getActiveConnections().stream()
                    .filter(c -> memberUuid.equals(
                            ServerDataParser.getText(ServerDataParser.parse(c.getServerData()), "memberUuid")
                    )).findFirst().orElseThrow(() -> new BaseException(OPENVIDU_TOKEN_NOT_FOUND));

            int participantCount = session.getActiveConnections().size();

            if (participantCount == 1) {
                session.close();
            } else {
                session.forceDisconnect(connection);
            }

        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new BaseException(OPENVIDU_SERVER_ERROR);
        }
    }

    private String generateCustomSessionId(Long meetingRoomId) {
        return sessionProps.getPrefix() + meetingRoomId;
    }

}
