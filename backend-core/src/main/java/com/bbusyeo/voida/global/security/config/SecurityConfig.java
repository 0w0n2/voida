package com.bbusyeo.voida.global.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * 인증/인가 환경 클래스 - JWT 기반 REST API 보호 (/v1/** 경로(헤더 기반 토큰 인증))
 * - Spring Security 환경설정 구성
 * - 웹서비스가 로드될 때 Spring Container에 의해 관리됨
 * - 사용자에 대한 Authentication/Authorization 에 대한 구성을 Bean 메서드로 주입
 *
 * @author hyewon
 */
// @Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // 수정 필요함(테스트 때문에 permitAll 해둠)
        http
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll() // 모든 요청 허용
                )
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .httpBasic(basic -> basic.disable()); // HTTP Basic 인증 비활성화

        return http.build();
    }
}
