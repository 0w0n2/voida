package com.bbusyeo.voida.global.security.filter;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponse;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.service.TokenBlackListService;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.internal.constraintvalidators.bv.PatternValidator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.SerializationUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * JwtAuthorizationFilter: JWT(JSON Web Token) 인증 처리 필터
 * 지정한 URL 별 JWT 유효성 검증을 수행하며 직접적인 사용자 (인증)을 확인
 * - JWT 토큰이 존재하지 않는 경우 -> 다음 필터로 수행되도록 처리
 * - JWT 토큰이 존재하는 경우 -> 토큰이 유효한지 검증 수행
 * @author hyewon
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {
    private static final String HTTP_METHOD_OPTIONS = "OPTIONS";

    private static final AntPathMatcher pathMatcher = new AntPathMatcher(); // contains는 순수 문자열 비교라 와일드 카드 체크가 안 됨

    private final TokenUtils tokenUtils;
    private final TokenBlackListService tokenBlackListService;

    // 토큰이 필요 없는 URL 리스트
    private static final List<String> NOT_USE_JWT_URL_LIST = List.of( // TODO-SECURITY: 화이트리스트(JWT 토큰 미필요 api) 리스트 설정 파일로 관리
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/swagger-ui.html",
        "/v1/auth/sign-in"
//        "/v1/auth/**"
    );

    // JWT 인증처리
    // 1. 토큰이 필요하지 않은 API 엔드포인트 확인 및 처리
    // 2. 클라이언트 요청의 Authorization 헤더에서 토큰을 추출하고 유효성 확인
    // 3. 토큰이 유효한 경우 사용자 ID를 확인하고 다음 필터로 진행
    // 4. 예외 발생 시 에러 응답 반환
    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            // 1. JWT 토큰이 필요하지 않은 요청 처리 -> 다음 필터로 넘김
            boolean isExcluded = NOT_USE_JWT_URL_LIST.stream()
                    .anyMatch(pattern -> pathMatcher.match(pattern, request.getRequestURI()));
            if (isExcluded) {
//             if (NOT_USE_JWT_URL_LIST.contains(request.getRequestURI())) {
                filterChain.doFilter(request, response);
                return;
            }

            // 2. 토큰이 필요 없는 HTTP Method OPTIONS 호출 발생 시 -> 다음 필터로 넘김
            if (HTTP_METHOD_OPTIONS.equals(request.getMethod())) {
                filterChain.doFilter(request, response);
                return;
            }

            // 3. JWT 토큰이 필요한 요청 처리 -> 토큰 추출 및 유효성 검사
            // + AccessToken blackList 검사
            String AccessToken = tokenUtils.getTokenFromRequest(request);
            if (!StringUtils.hasText(AccessToken)){
                throw new BaseException(BaseResponseStatus.TOKEN_USERNAME_NOT_FOUND);
            }
            if (tokenUtils.isInvalidToken(AccessToken)){
                throw new BaseException(BaseResponseStatus.INVALID_JWT_TOKEN);
            }
            if (tokenBlackListService.isBlacklisted(AccessToken)){
                throw new BaseException(BaseResponseStatus.INVALID_JWT_TOKEN);
            }
            
            // 4. 인증 객체 생성 및 SecurityContext 에 저장
            // 토큰이 유효할 경우 토큰에서 Authentication 객체를 가지고 와서 SecurityContext 에 저장
            Authentication authentication = tokenUtils.getAuthentication(AccessToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // TODO-SECURITY: username 추출 체크 로직 확인(username인지 userId인지...)
//            // 토큰에서 username 추출 및 체크
//            String username = tokenUtils.getUserNameFromToken(token);
//            if (!StringUtils.hasText(username)){
//                throw new BaseException(BaseResponseStatus.TOKEN_NOT_FOUND);
//            }

            // 인증 성공 시 다음 필터로 진행
            filterChain.doFilter(request, response); // 리소스로 접근
        } catch (BaseException e) { // Token Exception 발생 하였을 경우 -> 클라이언트에 응답값을 반환하고 종료
            log.warn("JWT 인증 실패: {}", e.getStatus().getMessage());
            SecurityContextHolder.clearContext(); // 인증 실패 시 SecurityContext 기존 정보 초기화(로그아웃 처리와 유사/IllegalArgumentException 방지)
            if (!response.isCommitted()) {
                setErrorResponse(response, e.getStatus());
            }
        } catch (Exception e) {
            log.error("JWT 필터 처리 중 알 수 없는 에러", e);
            SecurityContextHolder.clearContext();
            if (!response.isCommitted()) {
                setErrorResponse(response, BaseResponseStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // JWT 관련 예외 발생 시 JSON 형태의 에러 응답 직접 생성
    // Filter은 Spring MVC DispatcherServlet 보다 먼저 동작하여 Filter 에서 발생한 예외는 Spring 의 예외 처리(Advice)로 전달되지 않음
    private void setErrorResponse(HttpServletResponse response, BaseResponseStatus status)
            throws IOException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        BaseResponse<?> errorResponse = new BaseResponse<>(status);
        String json = new ObjectMapper().writeValueAsString(errorResponse);
        response.getWriter().write(json);
    }
}
