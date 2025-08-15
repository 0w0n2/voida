package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.meetingroom.repository.MemberMeetingRoomRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberQuickSlotRepository;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSettingRepository;
import com.bbusyeo.voida.api.member.repository.MemberSocialRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeleteAccountServiceImpl implements DeleteAccountService {

    private final MemberSettingRepository memberSettingRepository;
    private final MemberRepository memberRepository;
    private final MemberQuickSlotRepository memberQuickSlotRepository;
    private final MemberMeetingRoomRepository memberMeetingRoomRepository;
    private final MemberSocialRepository memberSocialRepository;

    @Transactional
    @Override
    public void deleteAccount(Long memberId) {
        // 1. member 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));

        // 2. 연관된 member_social 제거
        memberSocialRepository.deleteMemberSocialsByMemberId(member.getId());
        // 3. 연관된 member_setting 제거
        memberSettingRepository.deleteMemberSettingByMemberId(member.getId());
        // 4. member_quick_slot 제거
        memberQuickSlotRepository.deleteMemberQuickSlotsByMemberId(member.getId());
        // 5. meeting_room의 memberCount 감소
        List<MemberMeetingRoom> memberMeetingRooms = memberMeetingRoomRepository.findByMemberUuid(member.getMemberUuid());
        for (MemberMeetingRoom memberMeetingRoom : memberMeetingRooms) {
            MeetingRoom meetingRoom = memberMeetingRoom.getMeetingRoom();
            meetingRoom.decreaseMemberCount();
        }
        // 6. member_meeting_room 제거
        memberMeetingRoomRepository.deleteMemberMeetingRoomsByMemberUuid(member.getMemberUuid());

        // 7. member soft delete 처리
        member.softDelete(true);
        // TODO-MEMBER: soft delete 시 S3에 업로드 되어 있던 파일까지 삭제할 것인지
    }

    // 해당 멤버가 호스트인 대기실이 있는지 체크
    @Transactional(readOnly = true)
    @Override
    public void checkMemberIsHost(String memberUuid) {
        if (memberMeetingRoomRepository.existsByMemberUuidAndState(memberUuid, MemberMeetingRoomState.HOST)) {
            throw new BaseException(BaseResponseStatus.HOST_CANNOT_WITHDRAW);
        }
    }
}
