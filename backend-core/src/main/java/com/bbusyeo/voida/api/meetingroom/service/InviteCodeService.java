package com.bbusyeo.voida.api.meetingroom.service;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.meetingroom.repository.MeetingRoomRepository;
import com.bbusyeo.voida.api.meetingroom.repository.MemberMeetingRoomRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.concurrent.ThreadLocalRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class InviteCodeService {

    // 키 충돌 방지와 유지보수를 위해 접두사 추가하여 관리, 초대코드 만료 시간 수정할 일 있으면 hours만 바꾸면 됨.
    private static final String ROOM_ID_TO_INVITE_CODE_PREFIX = "room-id:";
    private static final String INVITE_CODE_TO_ROOM_ID_PREFIX = "invite-code:";
    private static final long INVITE_CODE_EXPIRATION_HOURS = 24;

    private final RedisDao redisDao;
    private final MeetingRoomRepository meetingRoomRepository;
    private final MemberMeetingRoomRepository memberMeetingRoomRepository;
    private final MemberRepository memberRepository;
    private final MeetingRoomService meetingRoomService;

    public String createInviteCode(Long meetingRoomId) {
        // 회의실 존재 여부 확인
        meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NOT_FOUND_MEETING_ROOM));

        String inviteCode;
        String redisInviteKey;

        do {

            int randomCode = ThreadLocalRandom.current().nextInt(100_000_000, 1_000_000_000);
            inviteCode = String.valueOf(randomCode);
            redisInviteKey = INVITE_CODE_TO_ROOM_ID_PREFIX + inviteCode;

        } while (redisDao.getValue(redisInviteKey) != null); // 유일한 코드가 생성될 때까지 반복

        Duration expiration = Duration.ofHours(INVITE_CODE_EXPIRATION_HOURS);

        // 초대코드 -> room ID 저장 (초대코드로 방 찾기 위해)
        redisDao.setValue(redisInviteKey, meetingRoomId.toString(), expiration);

        // room ID -> 초대코드 저장 (방장이 자기 방 코드 확인할 때 위해)
        String redisRoomKey = ROOM_ID_TO_INVITE_CODE_PREFIX + meetingRoomId;
        redisDao.setValue(redisRoomKey, inviteCode, expiration);
        return inviteCode;
    }

    public String getInviteCode(Long memberId, Long meetingRoomId) {
        // 방장 권한 확인
        meetingRoomService.checkHostAuthority(memberId, meetingRoomId);

        String redisKey = ROOM_ID_TO_INVITE_CODE_PREFIX + meetingRoomId;
        String inviteCode = (String) redisDao.getValue(redisKey);

        if (inviteCode == null) {
            throw new BaseException(BaseResponseStatus.EXPIRED_INVITE_CODE);
        }
        return inviteCode;
    }

    public void verifyInviteCodeAndJoin(Long memberId, String memberInviteCode) {

        String redisInviteKey = INVITE_CODE_TO_ROOM_ID_PREFIX + memberInviteCode;
        String roomIdStr = (String) redisDao.getValue(redisInviteKey);

        // 초대 코드가 틀렸거나, 만료 되었을 경우
        if (roomIdStr == null) {
            throw new BaseException(BaseResponseStatus.INVALID_INVITE_CODE);
        }
        Long meetingRoomId = Long.parseLong(roomIdStr);

        // member 정보와 대기실 정보 조회
        // 서비스에 등록된 member가 아닌 경우
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.ILLEGAL_ARGUMENT));

        // 입장하려고 하는 방이 없어졌을 경우
        MeetingRoom meetingRoom = meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NOT_FOUND_MEETING_ROOM));

        // 대기실 정원 확인
        if (meetingRoom.getMemberCount() >= 6) {
            throw new BaseException(BaseResponseStatus.MEETING_ROOM_FULL);
        }

        // 대기실에 member 추가
        MemberMeetingRoom plusParticipant = MemberMeetingRoom.builder()
                .member(member)
                .meetingRoom(meetingRoom)
                .state(MemberMeetingRoomState.PARTICIPANT)
                .build();
        memberMeetingRoomRepository.save(plusParticipant);

        // 멤버 수 증가
        meetingRoom.increaseMemberCount();
    }
}
