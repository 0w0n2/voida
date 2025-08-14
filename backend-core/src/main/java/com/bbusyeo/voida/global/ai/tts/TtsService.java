package com.bbusyeo.voida.global.ai.tts;

import org.springframework.web.multipart.MultipartFile;

/**
 * 단축키 음성 변환에 사용되는 TTS 서비스 인터페이스
 */
public interface TtsService {

    MultipartFile createSpeechByText(String message);
}
