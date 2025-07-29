package com.bbusyeo.voida.api.auth.dto;

import com.bbusyeo.voida.api.member.domain.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class SignInRequestDto {
    private String email;
    private String password;

    public Member toEntity(){
        return Member.builder()
                .email(email)
                .password(password)
                .build();
    }
}
