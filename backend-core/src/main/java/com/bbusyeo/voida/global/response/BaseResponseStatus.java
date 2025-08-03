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

    // Security - Token 응답
    ACCESS_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, false, 401, "액세스 토큰이 만료되었습니다."),
    
    // INVALID_JWT_TOKEN으로 합치는 거 추천
    ACCESS_TOKEN_INVALID(HttpStatus.UNAUTHORIZED, false, 401, "유효하지 않은 엑세스 토큰입니다."),
    REFRESH_TOKEN_INVALID(HttpStatus.UNAUTHORIZED, false, 401, "유효하지 않은 리프레시 토큰입니다."),
    UNSUPPORTED_JWT_TOKEN(HttpStatus.UNAUTHORIZED, false, 401, "지원되지 않는 JWT 토큰입니다."),
    INVALID_JWT_TOKEN(HttpStatus.UNAUTHORIZED, false, 401, "유효하지 않은 JWT 토큰입니다."),
    TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, false, 401, "인증이 필요한 요청입니다."),

    TOKEN_USERNAME_NOT_FOUND(HttpStatus.UNAUTHORIZED, false, 401, "토큰 내에 userName이 존재하지 않습니다."),
    ACCESS_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, false, 401, "토큰이 존재하지 않습니다."),

    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, false, 401, "ID와 PW가 일치하지 않습니다."),
    MEMBER_NOT_FOUND(HttpStatus.UNAUTHORIZED, false, 401, "존재하지 않는 회원입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, false, 403, "접근 권한이 없습니다."),
    
    // 랜덤 닉네임 생성
    NICKNAME_GENERATION_FAILED(HttpStatus.CONFLICT, false, 409, "랜덤 닉네임 생성을 실패했습니다."),
    // 소셜 로그인
    UNSUPPORTED_SOCIAL_PROVIDER(HttpStatus.BAD_REQUEST, false, 400, "지원하지 않는 소셜 로그인 타입입니다."),
    // 회원가입
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, false, 409, "이미 사용 중인 이메일입니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, false, 409, "이미 사용 중인 닉네임입니다."),

    /**
     * 500: 기타 에러.
     */
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, false, 500, "서버에서 예기치 않은 오류가 발생했습니다."),
    DATABASE_CONSTRAINT_VIOLATION(HttpStatus.CONFLICT, false, 509, "데이터베이스 제약 조건을 위반했습니다. "
        + "(유니크 키 중복, 외래 키 위반, NOT NULL 위반 등에서 발생합니다.)"),
    EMAIL_SEND_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, false, 500, "메일 발송에 실패했습니다."),

    /**
     * 600: S3 에러.
     */
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, false, 600, "파일 업로드에 실패했습니다.");


    private final HttpStatus httpStatus;
    private final boolean isSuccess;
    private final int code;
    private final String message;


}
