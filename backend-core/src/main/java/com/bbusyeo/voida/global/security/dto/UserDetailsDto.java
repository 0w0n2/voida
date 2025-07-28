package com.bbusyeo.voida.global.security.dto;

import com.bbusyeo.voida.api.member.domain.Member;
import lombok.*;
import lombok.experimental.Delegate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * UserDetails 구현체 (Spring security 인증 주체 정의)
 */
@Slf4j
@Getter
@AllArgsConstructor
public class UserDetailsDto implements UserDetails {

    @Delegate // Member 객체의 메소드를 이 클래스에서 직접 사용 가능
    private Member member;

    private Collection<? extends GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> roles = new ArrayList<>();
        if (member.getRole() != null) {
            String roleName = "ROLE_" + member.getRole();
            log.debug("권한 등록됨: {}", roleName);
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return member.getPassword();
    }

    @Override
    public String getUsername() {
        return member.getEmail();
    }

    /**
     * 계정이 만료되지 않았는지 여부 반환
     * 현재 항상 false 를 반환하므로 -> 모든 계정이 만료된 것으로 처리
     * @return
     */
    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    /**
     * 계정이 잠기지 않았는지 여부 반환
     * @return
     */
    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }
    
    /**
     * 자격 증명(비밀번호)이 만료되지 않았는지 여부 반환
     * @return
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    /**
     * 계정이 활성화되어 있는지 여부 반환
     * @return
     */
    @Override
    public boolean isEnabled() {
        return false;
    }
}
