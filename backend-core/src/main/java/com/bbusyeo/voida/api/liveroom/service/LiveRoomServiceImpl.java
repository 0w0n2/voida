package com.bbusyeo.voida.api.liveroom.service;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.MEETING_ROOM_MEMBER_NOT_FOUND;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.MEMBER_NOT_FOUND;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.MEMBER_SETTING_NOT_FOUND;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.OPENVIDU_SERVER_ERROR;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.OPENVIDU_SESSION_NOT_FOUND;
import static io.openvidu.java.client.ConnectionProperties.DefaultValues.role;

import com.bbusyeo.voida.api.liveroom.domain.model.Participant;
import com.bbusyeo.voida.api.liveroom.dto.out.SessionResponseDto;
import com.bbusyeo.voida.api.liveroom.dto.out.TokenResponseDto;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.meetingroom.repository.MemberMeetingRoomRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSettingRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.properties.OpenViduSessionProperties;
import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduException;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LiveRoomServiceImpl implements LiveRoomService {

    private final OpenVidu openVidu;
    private final OpenViduSessionProperties sessionProps;

    private final MemberRepository memberRepository;
    private final MemberSettingRepository memberSettingRepository;
    private final MemberMeetingRoomRepository memberMeetingRoomRepository;

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

            Participant participant = loadParticipant(memberUuid, meetingRoomId);

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

    private Participant loadParticipant(String memberUuid, Long meetingRoomId) {
        Member member = memberRepository.findByMemberUuid(memberUuid)
            .orElseThrow(() -> new BaseException(MEMBER_NOT_FOUND));

        MemberMeetingRoomState state = memberMeetingRoomRepository
            .findByMemberUuidAndMeetingRoomId(memberUuid, meetingRoomId)
            .orElseThrow(() -> new BaseException(MEETING_ROOM_MEMBER_NOT_FOUND))
            .getState();

        Boolean lipTalkMode = memberSettingRepository
            .findMemberSettingsByMemberId(member.getId())
            .orElseThrow(() -> new BaseException(MEMBER_SETTING_NOT_FOUND))
            .getLipTalkMode();

        return Participant.from(member, state, lipTalkMode);
    }

}
