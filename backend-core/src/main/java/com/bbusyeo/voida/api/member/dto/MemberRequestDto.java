package com.bbusyeo.voida.api.member.dto;

import com.bbusyeo.voida.api.member.domain.Member;
import lombok.*;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberRequestDto {

    private String email;
    private String nickname;

//    static public MemberDto toDto(Member member){
//        return MemberDto.builder()
//                .email(member.getEmail())
//                .nickname(member.getNickname())
//                .build();
//    }

    public Member toEntity(){
        return Member.builder()
                .email(email)
                .nickname(nickname)
                .build();
    }
}
