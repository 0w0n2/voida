package com.bbusyeo.voida.api.member.domain;

import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "member_social")
public class MemberSocial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @ManyToOne(fetch = FetchType.LAZY) // Many = MemberSocial, One = Member (한 명의 유저가 여러 개의 소셜 계정 가질 수 있음) - 이후 확장성을 위해 1:N으로 설계
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "provider_name", nullable = false)
    @Enumerated(EnumType.STRING)
    private ProviderName providerName;

    @Column(name = "provider_id", nullable = false, length = 255, unique = true)
    private String providerId;

    @Column(name = "email", nullable = false, length = 50, unique = true)
    private String email;

}
