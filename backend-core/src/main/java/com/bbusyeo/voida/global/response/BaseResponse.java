package com.bbusyeo.voida.global.response;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.SUCCESS;
import org.springframework.http.HttpStatus;
import com.bbusyeo.voida.global.support.TypeCaster;

public record BaseResponse<T>(HttpStatus httpStatus, Boolean isSuccess, String message, int code,
                              T result) {

    public BaseResponse(T result) {
        this(HttpStatus.OK, true, SUCCESS.getMessage(), SUCCESS.getCode(), result);
    }

    public BaseResponse() {
        this(HttpStatus.OK, true, SUCCESS.getMessage(), SUCCESS.getCode(), null);
    }

    public BaseResponse(T result, BaseResponseStatus status) {
        this(status.getHttpStatus(), true, status.getMessage(), status.getCode(), result);
    }

    public BaseResponse(BaseResponseStatus status) {
        this(status.getHttpStatus(), false, status.getMessage(), status.getCode(),
            TypeCaster.castMessage(status.getMessage()));
    }

    public BaseResponse(BaseResponseStatus status, String message) {
        this(status.getHttpStatus(), false, message, status.getCode(),
            TypeCaster.castMessage(status.getMessage()));
    }

}
