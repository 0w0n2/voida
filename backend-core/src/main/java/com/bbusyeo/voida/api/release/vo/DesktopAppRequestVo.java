package com.bbusyeo.voida.api.release.vo;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class DesktopAppRequestVo {

    @NotBlank(message = "URL은 필수 입력 항목입니다.")
    private String url;

}
