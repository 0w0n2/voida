package com.bbusyeo.voida.api.meetingroom.domain;

import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "member_meeting_room")
@IdClass(MemberMeetingRoomId.class)
// MemberMeetingRoom 엔티티 클래스
public class MemberMeetingRoom {

    @Id
    @Column(name = "member_id")
    private Long memberId;

    @Id
    @Column(name = "meeting_room_id")
    private Long meetingRoomId;

    /*
    혜원 Member 엔티티 작업 완료 후 아래 코드로 교체
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_room_id")
    private MeetingRoom meetingRoom;
    */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberMeetingRoomState state;

    @Builder
    public MemberMeetingRoom(Long memberId, Long meetingRoomId, MemberMeetingRoomState state) {
        this.memberId = memberId;
        this.meetingRoomId = meetingRoomId;
        this.state = state;
    }
}
