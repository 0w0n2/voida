package com.bbusyeo.voida.global.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * JWT 기반 REST API 보호 (/v1/** 경로(헤더 기반 토큰 인증))
 * 실제 /v1/** 경로에 대한 보안 필터 체인 정의 (세부 정책)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

//        http.csrf((auth) -> auth.disable()) // csrf disable
//            .cors(()
        //

        return http.build();
    }
}
