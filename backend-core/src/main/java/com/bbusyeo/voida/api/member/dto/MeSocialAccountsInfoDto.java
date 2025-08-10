package com.bbusyeo.voida.api.member.dto;

import com.bbusyeo.voida.api.member.domain.MemberSocial;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class MeSocialAccountsInfoDto {
    private String providerName;
    private String email;

    public static MeSocialAccountsInfoDto toDto(MemberSocial memberSocial) {
        return MeSocialAccountsInfoDto.builder()
                .providerName(memberSocial.getProviderName().getProviderName())
                .email(memberSocial.getEmail())
                .build();
    }
}
