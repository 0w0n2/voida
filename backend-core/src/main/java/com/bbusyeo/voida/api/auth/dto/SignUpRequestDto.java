package com.bbusyeo.voida.api.auth.dto;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import com.bbusyeo.voida.api.member.domain.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(description = "회원가입 요청 DTO")
public class SignUpRequestDto {

    @Email
    @NotBlank(message = "이메일을 입력해주세요.")
    private String email;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String password;

    @NotBlank(message = "닉네임을 입력해주세요.")
    private String nickname;

    private Boolean isSocial; // true: 소셜 회원가입

    private String providerName; // "google" → ProviderName.GOOGLE 자동 매핑

    public Member toMember(String memberUuid, String encodedPassword, String profileImageUrl) {
        return Member.builder()
                .memberUuid(memberUuid)
                .nickname(nickname)
                .email(email)
                .password(encodedPassword)
                .profileImageUrl(profileImageUrl)
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .isNewbie(true)
                .isDeleted(false)
                .build();
    }

}
