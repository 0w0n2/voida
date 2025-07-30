package com.bbusyeo.voida.global.security.filter;

import com.bbusyeo.voida.api.auth.dto.SignInRequestDto;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

/**
 *
 * UsernamePasswordAuthenticationFilter 를 확장하여 사용자 정의 인증 로직 구현
 * ㄴ email과 password 기반의 데이터를 Form 데이터로 전송을 받아 (인증)을 담당하는 필터
 *
 * (CustomAuthenticationFilter) -> CustomAuthenticationProvider 로 사용자 정보 전달 (그 후 DB 조회)
 */
@Component
@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        super.setAuthenticationManager(authenticationManager);
    }

    // 지정된 URL로 form 전송을 하였을 경우 파라미터 정보를 가져옴
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        UsernamePasswordAuthenticationToken authRequest;
        try {
            authRequest = getAuthRequest(request);
            setDetails(request, authRequest);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return this.getAuthenticationManager().authenticate(authRequest);
    }

    // Request로 받은 ID와 패스워드 기반으로 인증 토큰을 발급
    // ObjectMapper 을 사용하여 요청 본문에서 UserDto 객체를 추출
    // ID와 암호화된 패스워드로 usernamePasswordAuthentication Token 생성
    private UsernamePasswordAuthenticationToken getAuthRequest(HttpServletRequest request) throws Exception {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(JsonParser.Feature.AUTO_CLOSE_SOURCE, true);
            SignInRequestDto user = objectMapper.readValue(request.getInputStream(), SignInRequestDto.class);
            log.debug("1.CustomAuthenticationFilter :: userId:" + user.getEmail() + " userPw:" + user.getPassword());

            // ID와 암호화된 패스워드를 기반으로 usernamePasswordAuthentication 토큰 발급
            return new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        } catch (UsernameNotFoundException e){
            throw new UsernameNotFoundException(e.getMessage());
        }
    }
}
