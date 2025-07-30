package com.bbusyeo.voida.global.security.handler;

import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 전달받은 사용자의 아이디와 비밀번호를 기반으로 비즈니스 로직을 처리하여 사용자의 (인증)에 대해 검증
 * CustomAuthenticationFilter 로부터 생성된 토큰을 통하여 UserDetailsService 를 통해 DB(MySql) 내에서 정보를 조회
 */
@Slf4j
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private UserDetailsService userDetailsService;

    @NonNull
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        log.debug("CustomAuthenticationProvider");

        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication;

        // AuthenticationFilter 에서 생성된 토큰으로부터 아이디와 비밀번호 조회
        String id = token.getName(); // member.email
        String password = (String) token.getCredentials();

        // UserDetailsService 를 통해 DB 에서 아이디로 사용자 조회
        UserDetailsDto userDetailsDto = (UserDetailsDto) userDetailsService.loadUserByUsername(id);

        if (!(userDetailsDto.getPassword().equalsIgnoreCase(password))) {
            throw new BadCredentialsException(userDetailsDto.getUsername() + "Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetailsDto, password, userDetailsDto.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
