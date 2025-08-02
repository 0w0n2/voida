package com.bbusyeo.voida.global.security.service;

import com.bbusyeo.voida.api.auth.repository.AuthRepository;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 사용자 인증 정보를 로드하고 UserDetails 객체를 생성
 * UserDetails 객체 -> 인증된 사용자 정보
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final AuthRepository authRepository;    // AuthService 로 의존하지 않고 바로 Repository 가져오게 했는데 맞는 건지 모르겠음

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (!StringUtils.hasText(username)) {
            throw new AuthenticationServiceException("사용자 ID가 비어있습니다.");
        }
        
        // 서비스 호출하여 실제 DB 조회를 통해 사용자 정보 대조
        return authRepository.findByEmail(username)
                .map(UserDetailsDto::new) // TODO-정리: getAuthorities() 내에서 이미 member.getRole() 를 통해 GrantedAuthority 객체(SimpleGrantedAuthority)를 생성하고 있으므로 외부에서 굳이 권한 주입 안 해줘도 됨
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 사용자를 찾을 수 없습니다."));
    }
}
