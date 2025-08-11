package com.bbusyeo.voida.api.release.dto.in;

import com.bbusyeo.voida.api.release.domain.DesktopApp;
import com.bbusyeo.voida.api.release.vo.DesktopAppRequestVo;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
public class DesktopAppRequestDto {

    private String url;
    private String version;
    private LocalDateTime uploadDate;

    @Builder
    public DesktopAppRequestDto(String url, String version, LocalDateTime uploadDate) {
        this.url = url;
        this.version = version;
        this.uploadDate = uploadDate;
    }

    public static DesktopAppRequestDto toDto(String version, DesktopAppRequestVo requestVo) {
        return DesktopAppRequestDto.builder()
            .url(requestVo.getUrl())
            .version(version)
            .uploadDate(LocalDateTime.now())
            .build();
    }

    public DesktopApp toEntity() {
        return DesktopApp.builder()
            .version(version)
            .url(url)
            .uploadedAt(uploadDate)
            .build();
    }

    public DesktopApp toEntity(DesktopApp prevApp) {
        return DesktopApp.builder()
            .id(prevApp.getId())
            .version(version)
            .url(url)
            .uploadedAt(uploadDate)
            .build();
    }

}
