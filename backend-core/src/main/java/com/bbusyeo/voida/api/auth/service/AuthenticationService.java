package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
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
    private final MemberRepository memberRepository;

    public UserDetailsDto authenticate(String email, String password) {
        
        // 탈퇴한 회원의 로그인 방지
        memberRepository.findByEmail(email)
                .ifPresent(member -> {
                    if (member.getIsDeleted()) {
                        throw new BaseException(BaseResponseStatus.INVALID_CREDENTIALS);
                    }
                });
        
        // 로그인 로직 진행
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);

        Authentication authentication = authenticationProvider.authenticate(authenticationToken);

        return (UserDetailsDto) authentication.getPrincipal();
    }
}
