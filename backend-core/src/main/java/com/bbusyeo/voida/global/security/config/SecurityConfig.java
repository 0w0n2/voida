package com.bbusyeo.voida.global.security.config;

import com.bbusyeo.voida.global.security.filter.CustomAuthenticationFilter;
import com.bbusyeo.voida.global.security.filter.JwtAuthorizationFilter;
import com.bbusyeo.voida.global.security.handler.CustomAuthFailureHandler;
import com.bbusyeo.voida.global.security.handler.CustomAuthSuccessHandler;
import com.bbusyeo.voida.global.security.handler.CustomAuthenticationProvider;
import com.bbusyeo.voida.global.security.service.TokenBlackListService;
import com.bbusyeo.voida.global.security.util.CookieUtils;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * 인증/인가 환경 클래스 - JWT 기반 REST API 보호 (/v1/** 경로(헤더 기반 토큰 인증))
 * - Spring Security 환경설정 구성
 * - 웹서비스가 로드될 때 Spring Container에 의해 관리됨
 * - 사용자에 대한 Authentication/Authorization 에 대한 구성을 Bean 메서드로 주입
 *
 * @author hyewon
 */
@Configuration
@Slf4j
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final TokenUtils tokenUtils;
    private final CookieUtils cookieUtils;
    private final TokenBlackListService tokenBlackListService;
    private final ObjectMapper objectMapper;

    // 1. WebSecurityCustomizer -> 정적 자원(Resource)에 대해 인증된 사용자의 접근 (인가) 설정을 담당
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> {
            web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
//            web.ignoring().requestMatchers(
//                    "/swagger-ui/**",
//                    "/v3/api-docs/**",
//                    "/swagger-ui.html"
//            );
        };
    }

    // 2. SecurityFilterChain -> HTTP에 대한 (인증)과 (인가) 담당
    // 필터를 통해 (인증) 방식과 절차에 대한 설정 수행
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // (1) CORS 설정, CSRF/FormLogin 비활성화
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))                              // CORS 커스텀 설정 적용
                .csrf(AbstractHttpConfigurer::disable)                                                          // CSRF 보호 비활성화 (서버에 인증정보를 저장하지 않아서)
                .formLogin(AbstractHttpConfigurer::disable)                                                     // 폼 로그인 비활성화 (대신 커스텀으로 구성한 필터 사용)
                
                // (2) 경로별 인가 설정
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()
//                        // 로그인 경로
//                        .requestMatchers(HttpMethod.POST, "/v1/auth/login").permitAll()
//                        // Swagger, 공용 API
//                        .requestMatchers("/", "/v1/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
//                        .anyRequest().authenticated()
                        // TODO-SECURITY: 우선 모든 HTTP 요청에 대한 허용 (지금 대충해놨음)
                )

                
                // (3) Security Filter 등록
                .addFilterBefore(jwtAuthorizationFilter(), BasicAuthenticationFilter.class)                     // JWT 인증 (커스텀 필터), TokenUtils는 Spring이 자동 주입
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))   // 세션 미사용 (JWT 사용)
                .addFilterBefore(customAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)      // 사용자 인증(커스텀 필터)

                .build();
    }

    // 3. AuthenticationManager -> authenticate 의 (인증) 메서드를 제공하는 매니저
    // - Provider 의 인터페이스
    // - 과정 : CustomAuthenticationFilter -> AuthenticationManager(Interface) -> CustomAuthenticationProvider(implements)
    @Bean
    public AuthenticationManager authenticationManager(){
        return new ProviderManager(customAuthenticationProvider());
    }
    
    // 4. CustomAuthenticationProvider -> (인증) 제공자로 사용자의 이름과 비밀번호를 DB(MySQL)에서 제공하여 반환받음
    // TODO-SECURITY: CustomAuthenticationProvider 작성요망
    @Bean
    public CustomAuthenticationProvider customAuthenticationProvider(){
        return new CustomAuthenticationProvider(bCryptPasswordEncoder());
    }

    // 5. BCryptPasswordEncoder -> BCrypt 인코딩을 통해 비밀번호 암호화
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    // 6. CustomAuthenticationFilter -> 커스텀된 (인증) 필터
    // - 데이터 전달방식(form) 등 인증 과정 및 인증 후 처리에 대한 설정 구성
    // TODO-SECURITY: CustomAuthenticationFilter -> Handler 작성요망
    @Bean
    public CustomAuthenticationFilter customAuthenticationFilter(){
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(authenticationManager());
        customAuthenticationFilter.setFilterProcessesUrl("/v1/auth/sign-in");   // 지정된 로그인 엔드포인트로 요청 시 감지

        customAuthenticationFilter.setAuthenticationSuccessHandler(customAuthSuccessHandler());   // (인증) 성공 시 처리 전가
        customAuthenticationFilter.setAuthenticationFailureHandler(customAuthFailureHandler());   // (인증) 실패 시 처리 전가
        customAuthenticationFilter.afterPropertiesSet();

        return customAuthenticationFilter;
    }

    // 7. CustomAuthSuccessHandler -> (인증) 성공 후 수행될 Handler
    // TODO-SECURITY: CustomAuthSuccessHandler 작성요망
    @Bean
    public CustomAuthSuccessHandler customAuthSuccessHandler(){
        return new CustomAuthSuccessHandler(objectMapper, tokenUtils, cookieUtils);
    }

    // 8. CustomAuthFailureHandler -> (인증) 실패 시 수행될 Handler
    // TODO-SECURITY: CustomAuthFailureHandler 작성요망
    @Bean
    public CustomAuthFailureHandler customAuthFailureHandler(){
        return new CustomAuthFailureHandler();
    }

    // 9. JwtAuthorizationFilter -> JWT 토큰을 통해서 사용자 인증
    @Bean
    public JwtAuthorizationFilter jwtAuthorizationFilter(){
        return new JwtAuthorizationFilter(tokenUtils, tokenBlackListService);
    }
    
    // 10. CorsConfigurationSource -> CORS에 대한 설정을 커스텀으로 구성
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        /*
         * TODO-SECURITY: CORS 허용 origin 설정
         * 최종적으로 setAllowedOriginPattern 대신 setAllowedOrigins 에 지정 origin 입력할 것
         */
        // corsConfiguration.setAllowedOrigins(List.of("*"));              // 허용할 오리진 -> 모든 origin
        corsConfiguration.addAllowedOriginPattern("*");                 // 모든 origin 허용
        corsConfiguration.setAllowedMethods(List.of("*"));              // 허용할 HTTP 메서드 -> 모든 HTTP method
        corsConfiguration.setAllowedHeaders(List.of("*"));              // 허용할 헤더 -> 모든 header
        corsConfiguration.setAllowCredentials(true);                    // (인증) 정보 포함 요청 허용 ->
        // TODO-SECURITY: CORS -> RT 토큰 쿠키 문제 시 setAllowCredentials 재확인
        corsConfiguration.addExposedHeader("Set-Cookie");
        corsConfiguration.setMaxAge(3600L);                             // 프리플라이트 요청 결과를 3600초 동안 유지

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);     // 모든 경로에 대해 이 설정 적용
        return source;
    }
}
