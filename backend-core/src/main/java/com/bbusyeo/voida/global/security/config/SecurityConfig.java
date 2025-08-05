package com.bbusyeo.voida.global.security.config;

import com.bbusyeo.voida.global.security.filter.JwtAuthorizationFilter;
import com.bbusyeo.voida.global.security.handler.CustomAccessDeniedHandler;
import com.bbusyeo.voida.global.security.handler.CustomAuthenticationEntryPoint;
import com.bbusyeo.voida.global.security.handler.CustomAuthenticationProvider;
import com.bbusyeo.voida.global.security.handler.OAuth2SuccessHandler;
import com.bbusyeo.voida.global.security.service.CustomOauth2UserService;
import com.bbusyeo.voida.global.security.service.TokenBlackListService;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * 인증/인가 환경 클래스 - JWT 기반 REST API 보호 (/v1/** 경로(헤더 기반 토큰 인증))
 * - Spring Security 환경설정 구성
 * - 웹서비스가 로드될 때 Spring Container에 의해 관리됨
 * - 사용자에 대한 Authentication/Authorization 에 대한 구성을 Bean 메서드로 주입
 */
@Configuration
@Slf4j
@EnableWebSecurity
@EnableConfigurationProperties({SecurityWhitelistProperties.class, CorsProperties.class})
@RequiredArgsConstructor
public class SecurityConfig {

    private final TokenUtils tokenUtils;
    private final TokenBlackListService tokenBlackListService;
    private final UserDetailsService userDetailsService;
    private final ObjectMapper objectMapper;
    private final SecurityWhitelistProperties whitelistProperties;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final CorsProperties corsProperties;
    private final CustomOauth2UserService customOauth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    // SecurityFilterChain : HTTP 요청에 대한 보안 설정
    // 필터를 통해 (인증) 방식과 절차에 대한 설정 수행
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // (1) 기본 설정 : CORS, CSRF, FormLogin, Session 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))   // CORS 커스텀 설정 적용
                .csrf(AbstractHttpConfigurer::disable)                               // CSRF 보호 비활성화 (서버에 인증정보를 저장하지 않아서)
                .formLogin(AbstractHttpConfigurer::disable)                          // 폼 로그인 비활성화 (대신 커스텀으로 구성한 필터 사용)
                .httpBasic(AbstractHttpConfigurer::disable)                          // HTTP Basic 인증 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))   // 세션 인증 미사용 (JWT 사용)

                // (2) 경로별 인가 설정
                // Swagger, API 문서 관련 경로, 그외 인증 없이 접근해야 하는 API 허용
                .authorizeHttpRequests(auth -> {
                    whitelistProperties.getParsedWhitelist().forEach((method, urls) -> {
                        urls.forEach(url -> auth.requestMatchers(method, url).permitAll());
                    });
                    // 그 외 모든 요청은 인증 필요
                    auth.anyRequest().authenticated();
                })

                // (3) OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOauth2UserService)) // OAuth2 로그인 성공 시 후속 조치를 처리
                        .successHandler(oAuth2SuccessHandler) // 인증 성공 시 핸들러
                )

                // (3) JWT Filter 등록
                .addFilterBefore(authenticationFilter(), UsernamePasswordAuthenticationFilter.class)

                // (4) ExceptionHandling
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint) // 토큰 없이 인증 필요한 API 요청 → 401 응답
                        .accessDeniedHandler(accessDeniedHandler) // 토큰은 있는데 권한이 없는 경우 → 403 응답
                )

                .build();
    }

    // WebSecurityCustomizer : 정적 자원(Resource)에 대해 인증된 사용자의 접근 (인가) 설정을 담당
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> { // 정적 리소스 (CSS, JS, 이미지, Swagger UI 등)에 대해서는 Security Filter 체인을 적용하지 않음
            web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
        };
    }

    // JwtAuthorizationFilter : JWT 토큰 유효성 검증 커스텀 필터
    @Bean
    JwtAuthorizationFilter authenticationFilter() {
        return new JwtAuthorizationFilter(tokenUtils, tokenBlackListService, objectMapper, whitelistProperties);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomAuthenticationProvider customAuthenticationProvider() {
        return new CustomAuthenticationProvider(userDetailsService, bCryptPasswordEncoder());
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(customAuthenticationProvider());
    }

    // CorsConfigurationSource : CORS에 대한 설정을 커스텀으로 구성
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        /*
         * TODO-SECURITY: CORS 허용 origin 설정
         * 최종적으로 setAllowedOriginPattern 대신 setAllowedOrigins 에 지정 origin 입력할 것
         */
        corsConfiguration.setAllowedOrigins(corsProperties.getAllowedOrigins());           // 허용할 오리진 -> 모든 origin
        // corsConfiguration.addAllowedOriginPattern("*");                 // 모든 origin 허용
        corsConfiguration.setAllowedMethods(corsProperties.getAllowedMethods()); // 허용할 HTTP 메서드 -> 모든 HTTP method
        corsConfiguration.setAllowedHeaders(corsProperties.getAllowedHeaders());              // 허용할 헤더 -> 모든 header
        corsConfiguration.setAllowCredentials(corsProperties.getAllowCredentials());                    // (인증) 정보 포함 요청 허용
        // TODO-SECURITY: CORS -> RT 토큰 쿠키 문제 시 setAllowCredentials 재확인
        corsConfiguration.setExposedHeaders(corsProperties.getExposedHeaders());
        corsConfiguration.setMaxAge(corsProperties.getMaxAge());                             // 프리플라이트 요청 결과를 3600초 동안 유지

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);     // 모든 경로에 대해 이 설정 적용
        return source;
    }
}
