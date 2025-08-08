package com.bbusyeo.voida.api.member.dto;

import com.bbusyeo.voida.api.member.domain.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@Builder
public class MeProfileResponseInfoDto {
    private String nickname;
    private String profileImageUrl;
    private String email;

    public static MeProfileResponseInfoDto toDto(Member member){
        return MeProfileResponseInfoDto.builder()
                .nickname(member.getNickname())
                .profileImageUrl(member.getProfileImageUrl())
                .email(member.getEmail())
                .build();
    }
}
