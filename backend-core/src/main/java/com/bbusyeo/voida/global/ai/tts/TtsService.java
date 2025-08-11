package com.bbusyeo.voida.global.ai.tts;

import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

/**
 * 단축키 음성 변환에 사용되는 TTS 서비스 인터페이스
 */
public interface TtsService {

    /**
     * @param message 변환할 텍스트 메시지
     * @return 변환된 음성 데이터를 담고 있는 MultipartFile 객체를 포함하는 Mono 객체 (비동기)
     */
    Mono<MultipartFile> createSpeechByText(String message);
}
