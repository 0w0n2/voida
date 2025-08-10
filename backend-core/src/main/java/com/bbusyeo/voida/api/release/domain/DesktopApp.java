package com.bbusyeo.voida.api.release.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DesktopApp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 15)
    private String version;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Builder
    DesktopApp(String version, String url, LocalDateTime uploadedAt) {
        this.version = version;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

}
