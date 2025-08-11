package com.bbusyeo.voida.api.release.dto.out;

import com.bbusyeo.voida.api.release.domain.DesktopApp;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@ToString
@NoArgsConstructor
public class DesktopAppResponseDto {

    private String version;
    private String url;
    private LocalDateTime uploadedAt;

    @Builder
    public DesktopAppResponseDto(String version, String url, LocalDateTime uploadedAt) {
        this.version = version;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

    public static DesktopAppResponseDto from(DesktopApp desktopApp) {
        return DesktopAppResponseDto.builder()
                .version(desktopApp.getVersion())
                .url(desktopApp.getUrl())
                .uploadedAt(desktopApp.getUploadedAt())
                .build();
    }

}
