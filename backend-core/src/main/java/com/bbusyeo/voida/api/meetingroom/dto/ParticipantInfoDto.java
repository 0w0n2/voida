package com.bbusyeo.voida.api.meetingroom.dto;

import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.member.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantInfoDto {
    // 참여자 1명의 상세 정보를 담는 DTO

    private String nickname;
    private String profileImageUrl;
    private String state;
    private boolean lipTalkMode;
    private boolean isMine;

    public static ParticipantInfoDto of(MemberMeetingRoom memberMeetingRoom, Member member, String currentMemberUuid) {
        boolean isMine = member.getMemberUuid().equals(currentMemberUuid);

        // todo: lipTalkMode는 member 완성 후 실제 로직으로 변경
        return ParticipantInfoDto.builder()
                .nickname(member.getNickname())
                .profileImageUrl(member.getProfileImageUrl())
                .state(memberMeetingRoom.getState().name())
                .lipTalkMode(false)
                .isMine(isMine)
                .build();
    }
}
