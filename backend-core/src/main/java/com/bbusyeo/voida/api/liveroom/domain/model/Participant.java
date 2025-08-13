package com.bbusyeo.voida.api.liveroom.domain.model;

import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.member.domain.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class Participant {

    private String connectionId;
    private String nickname;
    private String profileImageUrl;
    private MemberMeetingRoomState state;
    private Boolean lipTalkMode;

    @Builder
    public Participant(String connectionId, String nickname, String profileImageUrl, MemberMeetingRoomState state,
        boolean lipTalkMode) {

        this.connectionId = connectionId;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.state = state;
        this.lipTalkMode = lipTalkMode;
    }

    public static Participant from(Member member, MemberMeetingRoomState state,
        boolean lipTalkMode) {

        return Participant.builder()
            .nickname(member.getNickname())
            .profileImageUrl(member.getProfileImageUrl())
            .state(state)
            .lipTalkMode(lipTalkMode)
            .build();
    }

}
