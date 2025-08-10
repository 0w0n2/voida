package com.bbusyeo.voida.api.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Builder
@Getter
public class MeSocialAccountsResponseDto {
    private List<MeSocialAccountsInfoDto> socialAccounts;

    public static MeSocialAccountsResponseDto toDto(List<MeSocialAccountsInfoDto> socialAccountsDto) {
        return MeSocialAccountsResponseDto.builder()
                .socialAccounts(socialAccountsDto)
                .build();
    }
}
