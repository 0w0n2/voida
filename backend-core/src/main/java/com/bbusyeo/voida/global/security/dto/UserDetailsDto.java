package com.bbusyeo.voida.global.security.dto;

import com.bbusyeo.voida.api.member.domain.MemberSocial;
import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.api.member.domain.enums.Role;
import com.bbusyeo.voida.api.member.domain.Member;
import lombok.*;
import lombok.experimental.Delegate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

/**
 * UserDetails 구현체 (Spring security 인증 주체 정의)
 */
@Slf4j
@Getter
public class UserDetailsDto implements UserDetails, OAuth2User {

    @Delegate // Member 객체의 메소드를 이 클래스에서 직접 사용 가능
    private final Member member;
    private OAuth2UserInfo oAuth2UserInfo;

    private Map<String, Object> attributes;

    // 일반 로그인 객체
    public UserDetailsDto(Member member) {
        this.member = member;
    }
    
    // 일반 + OAuth2 객체
    public UserDetailsDto(Member member, OAuth2UserInfo oAuth2UserInfo) {
        this.member = member;
        this.oAuth2UserInfo = oAuth2UserInfo;
    }

    // 사용자 권한 목록 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> roles = new ArrayList<>();
        Role role = member.getRole();
        if (role != null) {
            roles.add(new SimpleGrantedAuthority(role.getRoleName()));
        }
        return roles;
    }

    @Override
    public String getPassword() {
        return member.getPassword();
    }

    @Override
    public String getUsername() {
        return member.getEmail();
    }

    // 계정이 만료되지 않았는지 여부 반환
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정이 잠기지 않았는지 여부 반환
    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    // 자격 증명(비밀번호)이 만료되지 않았는지 여부 반환
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정이 활성화되어 있는지 여부 반환
    @Override
    public boolean isEnabled() {
        return true; // TODO-SECURITY: 탈퇴/비활성 등 처리 필요시 custom
    }

    @Override
    public String getName() {
        return null;
    }

    public MemberSocial toMemberSocialForLinking() {
        return MemberSocial.builder()
            .member(member)
            .email(oAuth2UserInfo.getProviderEmail())
            .providerName(ProviderName.from(oAuth2UserInfo.getProvideName()))
            .providerId(oAuth2UserInfo.getProviderId())
            .build();
    }
}
