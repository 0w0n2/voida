package com.bbusyeo.voida.global.ai.stt;

import com.bbusyeo.voida.global.ai.stt.dto.GMSSttResponseDto;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Objects;

/**
 * GMS STT 외부 API 와 통신하는 서비스
 */
@Slf4j
@Service
public class GMSSttService implements SttService {

    @Value("${ai.openai.audio.transcriptions.options.model}")
    private String model;

    private final WebClient webClient;

    public GMSSttService(
            WebClient.Builder webClientBuilder,
            @Value("${ai.openai.audio.transcriptions.endpoint}") String requestEndpoint,
            @Value("${ai.openai.api-key}") String openAiApiKey
    ) {
        this.webClient = webClientBuilder
                .baseUrl(requestEndpoint)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
                .build();
    }

    @Override
    public String transcribeAudio(MultipartFile audioFile) {
        try {
            // WebClient 는 Object 객체를 chunking 방식으로 전송하나 GMS 서버에서는 chunking 방식을 차단해둔 것 같음
            // 외부 라이브러리 HttpEntity, MultipartEntityBuilder 를 사용하여 직접 byte[] 로 직렬화하여 전송 (파일 용량에 따라 메모리 이슈 위험 존재)
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);

            builder.addBinaryBody("file", audioFile.getInputStream(), ContentType.APPLICATION_OCTET_STREAM, audioFile.getOriginalFilename());
            builder.addTextBody("model", model, ContentType.TEXT_PLAIN);
            builder.addTextBody("prompt", """ 
                    Transcribe this casual conversation exactly as it sounds.
                    Use correct punctuation and include filler words like 'um' and 'uh' to make it sound natural.
                    """, ContentType.TEXT_PLAIN);
            builder.addTextBody("language", "ko", ContentType.TEXT_PLAIN);

            HttpEntity multipartEntity = builder.build();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            multipartEntity.writeTo(outputStream);
            byte[] multipartBytes = outputStream.toByteArray();

            return Objects.requireNonNull(webClient.post()
                    .header(HttpHeaders.CONTENT_TYPE, multipartEntity.getContentType().getValue())
                    .bodyValue(multipartBytes)
                    .retrieve()
                    .bodyToMono(GMSSttResponseDto.class)
                    .block()).getText();
        } catch (IOException e) {
            throw new BaseException(BaseResponseStatus.FILE_CONVERSION_FAILED);
        } catch (Exception e) {
            throw new BaseException(BaseResponseStatus.STT_CONVERSION_FAILED);
        }
    }
}
