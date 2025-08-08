package com.bbusyeo.voida.api.member.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "member_quick_slot")
public class MemberQuickSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "message", nullable = false, length = 20)
    private String message;

    @Column(name = "hotkey", nullable = false, length = 250)
    private String hotkey;

    @Column(name = "url", nullable = false, length = 500)
    private String url;
}
