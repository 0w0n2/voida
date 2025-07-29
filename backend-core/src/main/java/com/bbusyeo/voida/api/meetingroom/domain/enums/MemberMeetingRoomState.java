package com.bbusyeo.voida.api.meetingroom.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MemberMeetingRoomState {
    HOST("HOST"),
    PARTICIPANT("PARTICIPANT");

    private final String value;
}
