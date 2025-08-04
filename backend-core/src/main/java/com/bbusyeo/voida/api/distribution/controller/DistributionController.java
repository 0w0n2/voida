package com.bbusyeo.voida.api.distribution.controller;

import com.bbusyeo.voida.api.distribution.dto.out.DistributionResponseDto;
import com.bbusyeo.voida.api.distribution.service.DistributionService;
import com.bbusyeo.voida.global.response.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/v1")
@Tag(name = "Desktop App Distribution")
@RequiredArgsConstructor
@RestController
public class DistributionController {

    private final DistributionService distributionService;

    @Operation(summary = "데스크톱 앱 정보 조회 API",
            description = """
                `latest`를 입력하면 최신 버전 정보를 반환합니다.\n\n
                version 형식은 `0.0.1`과 같은 형식을 사용하세요.
                """)
    @GetMapping("/desktop-apps/versions/{version}")
    public BaseResponse<DistributionResponseDto> getDesktopAppInfo(@PathVariable String version) {

        return new BaseResponse<>(distributionService.getDistributionByVersion(version));
    }

}
