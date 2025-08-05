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

    @Column(name = "member_uuid", nullable = false, length = 36)
    private String memberUuid;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "meeting_room_id")
    private MeetingRoom meetingRoom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberMeetingRoomState state;

    @Builder
    public MemberMeetingRoom(String memberUuid, MeetingRoom meetingRoom, MemberMeetingRoomState state) {
        this.memberUuid = memberUuid;
        this.meetingRoom = meetingRoom;
        this.state = state;
    }
}