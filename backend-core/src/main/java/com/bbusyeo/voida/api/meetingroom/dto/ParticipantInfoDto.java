package com.bbusyeo.voida.api.meetingroom.dto;

import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.MemberSetting;
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

    private String memberUuid;
    private String nickname;
    private String profileImageUrl;
    private String state;
    private boolean lipTalkMode;
    private String overlayPosition;
    private Integer liveFontSize;
    private Integer overlayTransparency;
    private boolean isMine;

    public static ParticipantInfoDto of(MemberMeetingRoom memberMeetingRoom, Member member, MemberSetting memberSetting, String currentMemberUuid) {
        boolean isMine = member.getMemberUuid().equals(currentMemberUuid);

        return ParticipantInfoDto.builder()
                .memberUuid(member.getMemberUuid())
                .nickname(member.getNickname())
                .profileImageUrl(member.getProfileImageUrl())
                .state(memberMeetingRoom.getState().name())
                .lipTalkMode(memberSetting.getLipTalkMode())
                .overlayPosition(memberSetting.getOverlayPosition().name())
                .liveFontSize(memberSetting.getLiveFontSize())
                .overlayTransparency(memberSetting.getOverlayTransparency())
                .isMine(isMine)
                .build();
    }
}
