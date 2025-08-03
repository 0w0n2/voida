package com.bbusyeo.voida.global.response;

import org.springframework.http.HttpStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BaseResponseStatus {

    /**
     * 200: 요청 성공.
     **/
    SUCCESS(HttpStatus.OK, true, 200, "요청에 성공하였습니다."),

    /**
     * 400: 사용자 요청 에러.
     */
    ILLEGAL_ARGUMENT(HttpStatus.BAD_REQUEST, false, 400, "잘못된 요청입니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, false, 401, "적절하지 않은 요청값입니다."),

    /**
     * 500: 기타 에러.
     */
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, false, 500, "서버에서 예기치 않은 오류가 발생했습니다."),
    DATABASE_CONSTRAINT_VIOLATION(HttpStatus.CONFLICT, false, 509, "데이터베이스 제약 조건을 위반했습니다. "
        + "(유니크 키 중복, 외래 키 위반, NOT NULL 위반 등에서 발생합니다.)"),


    /**
     * 600: S3 에러.
     */
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, false, 600, "파일 업로드에 실패했습니다."),

    /**
     * 700: 대기실 에러.
     */
    NOT_FOUND_MEMBER(HttpStatus.NOT_FOUND, false, 700, "해당 유저를 찾을 수 없습니다."),
    INVALID_INVITE_CODE(HttpStatus.BAD_REQUEST, false, 701, "초대코드가 옳지 않습니다."),
    EXPIRED_INVITE_CODE(HttpStatus.NOT_FOUND, false, 702, "초대 코드가 만료되었습니다."),
    FORBIDDEN_ACCESS(HttpStatus.FORBIDDEN, false, 703, "방장 권한이 없습니다."),
    NOT_FOUND_MEETING_ROOM(HttpStatus.NOT_FOUND, false, 704, "존재하지 않는 대기실입니다."),
    MEETING_ROOM_FULL(HttpStatus.CONFLICT, false, 705, "대기실 정원이 가득 찼습니다."),
    ALREADY_PARTICIPATING(HttpStatus.CONFLICT, false, 706, "이미 참여중인 방입니다."),
    INVITE_CODE_GENERATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, false, 707, "참여코드 생성 오류. 잠시 후 다시 실행해주세요."),
    CANNOT_CHANGE_TO_SELF(HttpStatus.BAD_REQUEST, false, 708, "자신에겐 불가능한 요청 입니다."),
    HOST_CANNOT_LEAVE(HttpStatus.BAD_REQUEST, false, 709, "방장은 대기실을 탈퇴할 수 없습니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, false, 710, "해당 유저를 찾을 수 없습니다.");


    private final HttpStatus httpStatus;
    private final boolean isSuccess;
    private final int code;
    private final String message;

}
