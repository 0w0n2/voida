package com.bbusyeo.voida.global.ai.stt;

import org.springframework.web.multipart.MultipartFile;

/**
 * 라이브 음성 SST 변환에 사용되는 서비스 인터페이스
 */
public interface SttService {
    String transcribeAudio(MultipartFile audioFile);
}
