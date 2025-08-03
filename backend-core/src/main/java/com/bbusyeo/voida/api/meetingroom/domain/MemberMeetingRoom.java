package com.bbusyeo.voida.api.meetingroom.domain;

import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.member.domain.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "member_meeting_room")
public class MemberMeetingRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "meeting_room_id")
    private MeetingRoom meetingRoom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberMeetingRoomState state;

    @Builder
    public MemberMeetingRoom(Member member, MeetingRoom meetingRoom, MemberMeetingRoomState state) {
        this.member = member;
        this.meetingRoom = meetingRoom;
        this.state = state;
    }

    // 방장/참여자 상태 변경할 수 있는 메서드
    public void updateState(MemberMeetingRoomState state) {
        this.state = state;
    }

}