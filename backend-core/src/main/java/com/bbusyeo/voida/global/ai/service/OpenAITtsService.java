package com.bbusyeo.voida.global.ai.service;

import com.bbusyeo.voida.global.ai.dto.CustomMultipartFile;
import com.bbusyeo.voida.global.ai.dto.OpenAITtsRequestDto;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Service
public class OpenAITtsService {

    @Value("${ai.openai.api-key}")
    private String openAiApiKey;

    @Value("${ai.openai.audio.speech.options.model}")
    private String model;

    private final WebClient webClient;

    public OpenAITtsService(
            WebClient.Builder webClientBuilder,
            @Value("${ai.openai.audio.speech.endpoint}") String requestEndpoint) {
        this.webClient = webClientBuilder.baseUrl(requestEndpoint).build();
    }

    public Mono<CustomMultipartFile> createSpeechReactive(String message) {
        // 요청 본문
        OpenAITtsRequestDto requestDto = OpenAITtsRequestDto.builder()
                .model(model)
                .voice("nova")
                .input(message)
                .response_format("mp3")
                .build();

        log.info("requestDto:{}", requestDto);

        return webClient.post()
                .header("Authorization", "Bearer " + openAiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.valueOf("audio/mpeg"))
                .bodyValue(requestDto)
                .retrieve()
                .bodyToMono(byte[].class)
                .log("openai-tts-call")
                .map(audioBytes -> {
                    String filename = "tts_audio.mp3";
                    String contentType = "audio/mpeg";
                    return new CustomMultipartFile(audioBytes, filename, contentType);
                })
                .onErrorMap(e -> new BaseException(BaseResponseStatus.TTS_CONVERSION_FAILED));

    }
}
