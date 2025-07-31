package com.bbusyeo.voida.api.meetingroom.service;

import com.bbusyeo.voida.api.meetingroom.repository.MeetingRoomRepository;
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
    private static final String INVITE_CODE_KEY_PREFIX = "meetingroom:";
    private static final long INVITE_CODE_EXPIRATION_HOURS = 24;

    private final RedisDao redisDao;
    private final MeetingRoomRepository meetingRoomRepository;

    public String createInviteCode(Long meetingRoomId) {
        // 회의실 존재 여부 확인
        meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NOT_FOUND_MEETING_ROOM));

        // 9자리 랜덤 숫자 초대 코드 생성
        int randomCode = ThreadLocalRandom.current().nextInt(100_000_000, 1_000_000_000);
        String inviteCode = String.valueOf(randomCode);

        // redis에 유효시간과 함께 저장
        String redisKey = INVITE_CODE_KEY_PREFIX + meetingRoomId;
        redisDao.setValue(redisKey, inviteCode, Duration.ofHours(INVITE_CODE_EXPIRATION_HOURS));

        return inviteCode;
    }
}
