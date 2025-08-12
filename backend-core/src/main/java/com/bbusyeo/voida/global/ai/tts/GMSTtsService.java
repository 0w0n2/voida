package com.bbusyeo.voida.global.ai.tts;

import com.bbusyeo.voida.global.support.CustomMultipartFile;
import com.bbusyeo.voida.global.ai.tts.dto.GMSTtsRequestDto;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * SSAFY GMS - gpt-4o-mini-tts 모델 활용하여 TTS 생성하는 서비스 구현체
 */
@Slf4j
@Service
public class GMSTtsService implements TtsService {

    @Value("${ai.openai.audio.speech.options.model}")
    private String model;

    private final WebClient webClient;
    private static final String contentType = "audio/mpeg";
    private static final String filename = "tts_audio.mp3"; // 임시 파일명

    // 생성자에서 WebClient 기본 설정을 주입받아 처리
    public GMSTtsService(
            WebClient.Builder webClientBuilder,
            @Value("${ai.openai.audio.speech.endpoint}") String requestEndpoint,
            @Value("${ai.openai.api-key}") String openAiApiKey
    ) {
        this.webClient = webClientBuilder
                .baseUrl(requestEndpoint)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public MultipartFile createSpeechByText(String message) {
        GMSTtsRequestDto requestDto = GMSTtsRequestDto.toDto(model, message); // 요청 본문

        return webClient.post()
                .accept(MediaType.valueOf(contentType))
                .bodyValue(requestDto)
                .retrieve()
                .bodyToMono(byte[].class)
                .map(this::toMultipartFile)
                .cast(MultipartFile.class)
                .onErrorMap(e -> new BaseException(BaseResponseStatus.TTS_CONVERSION_FAILED))
                .block();
    }

    // byte[] 를 MultipartFile 객체로 변환
    private CustomMultipartFile toMultipartFile(byte[] audioBytes) {
        return new CustomMultipartFile(audioBytes, filename, contentType);
    }
}
