package com.bbusyeo.voida.global.config;

import io.openvidu.java.client.OpenVidu;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

@Configuration
public class OpenViduConfig {

    @Bean
    public OpenVidu openVidu(
        @Value("${openvidu.url}") String url,
        @Value("${openvidu.secret}") String secret) {

        return new OpenVidu(url, secret);
    }

}
