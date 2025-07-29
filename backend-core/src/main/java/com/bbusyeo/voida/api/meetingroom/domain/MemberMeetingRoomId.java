package com.bbusyeo.voida.api.meetingroom.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
// 복합키 클래스
public class MemberMeetingRoomId implements Serializable {

    private Long memberId;
    private Long meetingRoomId;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        MemberMeetingRoomId that = (MemberMeetingRoomId) o;
        return Objects.equals(getMemberId(), that.getMemberId()) && Objects.equals(
                getMeetingRoomId(), that.getMeetingRoomId());
    }
    @Override
    public int hashCode() {
        return Objects.hash(getMemberId(), getMeetingRoomId());
    }
}