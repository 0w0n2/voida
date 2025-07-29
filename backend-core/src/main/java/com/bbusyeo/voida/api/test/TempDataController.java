package com.bbusyeo.voida.api.test;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.meetingroom.repository.MeetingRoomRepository;
import com.bbusyeo.voida.api.meetingroom.repository.MemberMeetingRoomRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TempDataController {

    private final MemberRepository memberRepository;
    private final MeetingRoomRepository meetingRoomRepository;
    private final MemberMeetingRoomRepository memberMeetingRoomRepository;

    /**
     * 테스트용 방장 권한 부여 API
     * @param memberId 방장 권한을 부여할 멤버의 ID
     * @param meetingRoomId 해당 멤버가 방장이 될 방의 ID
     * @return 생성된 MemberMeetingRoom 관계 정보
     */
    @PostMapping("/host-setup")
    public MemberMeetingRoom setupHost(@RequestParam Long memberId, @RequestParam Long meetingRoomId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find member with id: " + memberId));
        MeetingRoom meetingRoom = meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find meeting room with id: " + meetingRoomId));

        MemberMeetingRoom hostLink = MemberMeetingRoom.builder()
                .member(member)
                .meetingRoom(meetingRoom)
                .state(MemberMeetingRoomState.HOST)
                .build();

        return memberMeetingRoomRepository.save(hostLink);
    }
}