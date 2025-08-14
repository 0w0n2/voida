package com.bbusyeo.voida.global.support;

import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

/**
 * byte[] 을 MultiFile 타입으로 변환
 */
@AllArgsConstructor
public class CustomMultipartFile implements MultipartFile {
    private final byte[] input;
    private final String filename;
    private final String contentType;

    @Override
    public String getName() {
        return "file"; // 폼 필드 이름을 반환 (임의 지정)
    }

    @Override
    public String getOriginalFilename() {
        return filename;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public boolean isEmpty() {
        return input == null || input.length == 0;
    }

    @Override
    public long getSize() {
        return input.length;
    }

    @Override
    public byte[] getBytes() throws IOException {
        return input;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(input);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(input);
        }
    }
}
