package com.bbusyeo.voida.api.distribution.dto.out;

import com.bbusyeo.voida.api.distribution.domain.DesktopApp;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@ToString
@NoArgsConstructor
public class DistributionResponseDto {

    private String version;
    private String url;
    private LocalDateTime uploadedAt;

    @Builder
    public DistributionResponseDto(String version, String url, LocalDateTime uploadedAt) {
        this.version = version;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

    public static DistributionResponseDto from(DesktopApp desktopApp) {
        return DistributionResponseDto.builder()
                .version(desktopApp.getVersion())
                .url(desktopApp.getUrl())
                .uploadedAt(desktopApp.getUploadedAt())
                .build();
    }

}
