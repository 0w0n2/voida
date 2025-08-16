package com.bbusyeo.voida.api.live.controller;

import com.bbusyeo.voida.api.live.dto.SttResponseDto;
import com.bbusyeo.voida.global.ai.stt.SttService;
import com.bbusyeo.voida.global.response.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@Tag(name = "Live")
@RequestMapping("/v1/lives")
public class LiveController {

    private final SttService sttService;

    @Operation(summary = "입력 받은 음성 파일을 STT 변환하는 API")
    @PostMapping(value = "/stt", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponse<SttResponseDto> stt(
            @RequestPart(value = "sessionId") String sessionId,
            @RequestPart(value = "soundFile") MultipartFile soundFile
            ) {
        String sttText = sttService.transcribeAudio(soundFile);
        return new BaseResponse<>(SttResponseDto.toDto(sttText, sessionId));
    }
}
