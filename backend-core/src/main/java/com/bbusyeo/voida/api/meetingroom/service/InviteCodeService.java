package com.bbusyeo.voida.api.meetingroom.service;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.meetingroom.dto.InviteCodeResponseDto;
import com.bbusyeo.voida.api.meetingroom.repository.MeetingRoomRepository;
import com.bbusyeo.voida.api.meetingroom.repository.MemberMeetingRoomRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class InviteCodeService {
    
    public InviteCodeResponseDto createInviteCode(String memberUuid, Long meetingRoomId) {
        // 방장 여부 확인
        meetingRoomService.checkHostAuthority(memberUuid, meetingRoomId);

        // 대기실 존재 여부 확인
        meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NOT_FOUND_MEETING_ROOM));

        // 재발급시, 기존 발급된 초대 코드 있으면 찾아서 삭제
        String roomToInviteCode = MEETING_ROOM_ID_TO_INVITE_CODE_PREFIX + meetingRoomId;
        String oldInviteCode = (String) redisDao.getValue(roomToInviteCode);
        if (oldInviteCode != null) {
            // 기존 code -> room 정보 삭제
            redisDao.deleteValue(INVITE_CODE_TO_ROOM_ID_PREFIX + oldInviteCode);
        }


        // 유니크한 초대 코드 생성 (최대 5회 시도)
        String uniqueInviteCode = null;
        for (int i = 0; i < MAX_RETRY_COUNT; i++) {
            String strNumberCode = generateStrNumberCode();
            String redisInviteKey = INVITE_CODE_TO_ROOM_ID_PREFIX + strNumberCode;

            // 생성된 코드가 이미 다른 대기실의 키로 존재하는지 확인
            if (redisDao.getValue(redisInviteKey) == null) {
                // 존재하지 않는다면, 이 코드를 유니크한 코드로 설정하고 종료
                uniqueInviteCode = strNumberCode;
                break;
            }
        }

        // 5회 시도에도 유니크한 코드를 찾지 못했다면, 예외 처리
        if (uniqueInviteCode == null) {
            throw new BaseException(BaseResponseStatus.INVITE_CODE_GENERATION_FAILED);
        }

        // 초대 코드 저장 (24시간 유효)
        Duration expiration = Duration.ofHours(INVITE_CODE_EXPIRATION_HOURS);
        String redisInviteKey = INVITE_CODE_TO_ROOM_ID_PREFIX + uniqueInviteCode;

        // 초대코드를 키로, 대기실 ID를 저장 (참여 시 사용)
        redisDao.setValue(redisInviteKey, meetingRoomId.toString(), expiration);
        // 대기실 ID를 키로, 초대코드를 저장 (조회 시 사용, 기존 값이 있다면 덮어쓰기)
        redisDao.setValue(roomToInviteCode, uniqueInviteCode, expiration);

        return new InviteCodeResponseDto(uniqueInviteCode);
    }

    @Transactional(readOnly = true)
    public InviteCodeResponseDto getInviteCode(String memberUuid, Long meetingRoomId) {
        // 방장 권한 확인
        meetingRoomService.checkHostAuthority(memberUuid, meetingRoomId);

        // 대기실 ID를 키로 초대 코드 조회
        String redisKey = MEETING_ROOM_ID_TO_INVITE_CODE_PREFIX + meetingRoomId;
        String inviteCode = (String) redisDao.getValue(redisKey);

        // 초대 코드가 만료 됐으면 예외 처리
        if (inviteCode == null) {
            throw new BaseException(BaseResponseStatus.EXPIRED_INVITE_CODE);
        }
        return new InviteCodeResponseDto(inviteCode);
    }

    // 초대 코드 검증 및 참여
    @Transactional
    public void verifyInviteCodeAndJoin(String memberUuid, String userInviteCode) {
        // member가 입력한 초대 코드를 키로 Redis에 대기실 ID 조회
        String redisInviteKey = INVITE_CODE_TO_ROOM_ID_PREFIX + userInviteCode;
        String roomIdStr = (String) redisDao.getValue(redisInviteKey);

        // 대기실 ID가 조회되지 않으면 코드가 틀렸거나 만료된것, 예외 처리
        if (roomIdStr == null) {
            throw new BaseException(BaseResponseStatus.INVALID_INVITE_CODE);
        }
        Long meetingRoomId = Long.parseLong(roomIdStr);

        // 참여하려는 member가 존재하는지에 대해서와 참여 요청한 대기실이 존재하는지 확인
        Member member = memberRepository.findByMemberUuid(memberUuid)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));

        MeetingRoom meetingRoom = meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NOT_FOUND_MEETING_ROOM));

        // member가 이미 해당 대기실에 참여하고 있는지 확인
        memberMeetingRoomRepository.findByMemberUuidAndMeetingRoomId(memberUuid, meetingRoomId)
                .ifPresent(m -> {
                    // 이미 참여중이라면 예외 처리
                    throw new BaseException(BaseResponseStatus.ALREADY_PARTICIPATING);
                });

        // 대기실 인원 확인
        if (meetingRoom.getMemberCount() >= 6) {
            throw new BaseException(BaseResponseStatus.MEETING_ROOM_FULL);
        }

        // 모든 로직 통과했다면 대기실에 member 추가
        MemberMeetingRoom newMember = MemberMeetingRoom.builder()
                .memberUuid(memberUuid)
                .meetingRoom(meetingRoom)
                .state(MemberMeetingRoomState.PARTICIPANT)
                .build();
        memberMeetingRoomRepository.save(newMember);

        // 대기실 현재 인원 수 1 증가
        meetingRoom.increaseMemberCount();
    }

    // 입장 코드 생성 메서드
    // 보안 고려해 SecureRandom, 메모리 성능 고려해 StringBuilder 사용
    private String generateStrNumberCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(INVITE_CODE_LENGTH);
        for (int i = 0; i < INVITE_CODE_LENGTH; i++) {
            sb.append(ALPHABET_NUM.charAt(random.nextInt(ALPHABET_NUM.length())));
        }
        return sb.toString();
    }

    // 비즈니스 로직의 가독성을 위해 의존성과 상수 요소 하단에 작성
    private static final String MEETING_ROOM_ID_TO_INVITE_CODE_PREFIX = "meeting-room-id:";
    private static final String INVITE_CODE_TO_ROOM_ID_PREFIX = "invite-code:";
    private static final long INVITE_CODE_EXPIRATION_HOURS = 24;
    private static final int MAX_RETRY_COUNT = 5;
    private static final int INVITE_CODE_LENGTH = 9;
    private static final String ALPHABET_NUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private final RedisDao redisDao;
    private final MeetingRoomRepository meetingRoomRepository;
    private final MemberMeetingRoomRepository memberMeetingRoomRepository;
    private final MeetingRoomService meetingRoomService;
    private final MemberRepository memberRepository;
}
