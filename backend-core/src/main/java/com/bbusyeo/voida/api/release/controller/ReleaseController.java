package com.bbusyeo.voida.api.release.controller;

import com.bbusyeo.voida.api.release.dto.in.DesktopAppRequestDto;
import com.bbusyeo.voida.api.release.dto.out.DesktopAppResponseDto;
import com.bbusyeo.voida.api.release.service.ReleaseService;
import com.bbusyeo.voida.api.release.vo.DesktopAppRequestVo;
import com.bbusyeo.voida.global.response.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/v1/releases/desktop-apps")
@Tag(name = "Desktop App Release")
@RequiredArgsConstructor
@RestController
public class ReleaseController {

    private final ReleaseService releaseService;

    @Operation(summary = "데스크톱 앱 릴리스 최신 정보 조회 API")
    @GetMapping("/latest")
    public BaseResponse<DesktopAppResponseDto> getLatestRelease() {

        return new BaseResponse<>(releaseService.getLatestRelease());
    }

    @Operation(summary = "데스크톱 앱 특정 버전 릴리스 정보 조회 API",
            description = "version 형식은 `0.0.0`과 같은 형식을 사용하세요.")
    @GetMapping("/versions/{version}")
    public BaseResponse<DesktopAppResponseDto> getReleaseByVersion(@PathVariable String version) {

        return new BaseResponse<>(releaseService.getReleaseByVersion(version));
    }

    @Operation(summary = "데스크톱 앱 릴리스 등록 API",
        description = "version 형식은 `0.0.0`과 같은 형식을 사용하세요.")
    @PostMapping("/versions/{version}")
    public BaseResponse<Void> registerReleaseByVersion(
        @PathVariable String version, @RequestBody DesktopAppRequestVo requestVo) {

        releaseService.createRelease(DesktopAppRequestDto.toDto(version, requestVo));
        return new BaseResponse<>();
    }

}
