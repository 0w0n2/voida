package com.bbusyeo.voida.global.security.filter;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.config.SecurityWhitelistProperties;
import com.bbusyeo.voida.global.security.service.jwt.TokenBlackListService;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// 발급된 토큰을 검증하는 인가(Authorization)을 담당
// 토큰이 있으면 검증하고, 없으면 그냥 통과
// 토큰이 없는 사용자가 특정 API 에 접근할 수 있는지는 SecurityConfig 의 authorizeHttpRequest 가 판단
@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final TokenUtils tokenUtils;
    private final TokenBlackListService tokenBlackListService;
    private final ObjectMapper objectMapper;
    private final SecurityWhitelistProperties securityWhitelistProperties;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            // 0. permitAll 경로인지 확인
            String requestMethod = request.getMethod();
            String requestURI = request.getRequestURI();

            if (!isPermitAll(requestMethod, requestURI)) {
                // 1. 토큰 추출
                String accessToken = tokenUtils.getTokenFromRequest(request);

                // 2. 토큰이 존재할 경우에만 유효성 검사
                if (StringUtils.hasText(accessToken)) {
                    if (tokenUtils.isTokenInvalid(accessToken)) { // 유효하지 않은 토큰 (401)
                        throw new BaseException(BaseResponseStatus.ACCESS_TOKEN_INVALID);
                    }
                    if (tokenBlackListService.isBlacklistedAccess(accessToken)) { // 블랙리스트 처리된 토큰, 유효하지 않은 토큰 (401)
                        throw new BaseException(BaseResponseStatus.ACCESS_TOKEN_INVALID);
                    }
                    // 3. 인증 객체 생성 및 SecurityContext 에 저장
                    // 토큰이 유효할 경우 토큰에서 Authentication 객체를 가지고 와서 SecurityContext 에 저장
                    Authentication authentication = tokenUtils.getAuthentication(accessToken);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (BaseException e) { // throw 한 커스텀 예외들을 처리
            handleException(response, e.getStatus());
            return;
        } catch (Exception e) { // 서버 에러 처리
            log.error("JWT 토큰 처리 중 알 수 없는 에러 발생, {}", e.getMessage());
            handleException(response, BaseResponseStatus.INTERNAL_SERVER_ERROR);
            return;
        }
        filterChain.doFilter(request, response); // 4. 다음 필터로 요청 전달
    }

    // JWT 관련 예외 발생 시 JSON 형태의 에러 응답 직접 생성
    // Filter은 Spring MVC DispatcherServlet 보다 먼저 동작하여 Filter 에서 발생한 예외는 Spring 의 예외 처리(Advice)로 전달되지 않음
    private void handleException(HttpServletResponse response, BaseResponseStatus status) throws IOException {
        SecurityContextHolder.clearContext();

        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(status.getHttpStatus().value());
        BaseResponse<Object> errorResponse = new BaseResponse<>(status);
        String jsonResponse = objectMapper.writeValueAsString(errorResponse);
        response.getWriter().write(jsonResponse);
    }

    private boolean isPermitAll(String method, String uri) {
        return securityWhitelistProperties.getParsedWhitelist().entrySet().stream()
                .anyMatch(entry ->
                        entry.getKey().matches(method) &&
                                entry.getValue().stream().anyMatch(pattern -> pathMatches(pattern, uri))
                );
    }

    private boolean pathMatches(String pattern, String uri) {
        return new AntPathMatcher().match(pattern, uri);
    }
}
