package com.bbusyeo.voida.api.liveroom.service;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.MEETING_ROOM_MEMBER_NOT_FOUND;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.MEMBER_NOT_FOUND;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.MEMBER_SETTING_NOT_FOUND;

import com.bbusyeo.voida.api.liveroom.domain.model.Participant;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.meetingroom.repository.MemberMeetingRoomRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSettingRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class ParticipantService {

    private final MemberRepository memberRepository;
    private final MemberSettingRepository memberSettingRepository;
    private final MemberMeetingRoomRepository memberMeetingRoomRepository;

    public Participant loadParticipant(String memberUuid, Long meetingRoomId) {
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
