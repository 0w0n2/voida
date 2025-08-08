package com.bbusyeo.voida.api.member.domain;

import com.bbusyeo.voida.api.member.constant.MemberValue;
import com.bbusyeo.voida.api.member.domain.enums.OverlayPosition;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "member_setting")
public class MemberSetting implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_setting_id", nullable = false)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "lip_talk_mode", nullable = false)
    private Boolean lipTalkMode;

    @Enumerated(EnumType.STRING)
    @Column(name = "overlay_position", nullable = false)
    private OverlayPosition overlayPosition;

    @Column(name = "live_font_size", nullable = false)
    private Integer liveFontSize;

    @Column(name = "overlay_transparency", nullable = false)
    private Integer overlayTransparency;

    public static MemberSetting toDefaultSetting(Member member){
        return MemberSetting.builder()
                .member(member)
                .lipTalkMode(MemberValue.DEFAULT_LIP_TALK_MODE)
                .overlayPosition(MemberValue.DEFAULT_OVERLAY_POSITION)
                .liveFontSize(MemberValue.DEFAULT_LIVE_FONT_SIZE)
                .overlayTransparency(MemberValue.DEFAULT_OVERLAY_TRANSPARENCY)
                .build();
    }
}
