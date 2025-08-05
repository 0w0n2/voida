package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

/**
 * 이메일/비밀번호 기반으로 사용자를 인증하고 인증된 사용자 정보를 반환
 * 순환 참조 문제 때문에 TokenAuthService 에서 분리
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationProvider authenticationProvider;

    public UserDetailsDto authenticate(String email, String password) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);

        Authentication authentication = authenticationProvider.authenticate(authenticationToken);

        return (UserDetailsDto) authentication.getPrincipal();
    }
}
