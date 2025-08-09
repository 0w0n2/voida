package com.bbusyeo.voida.api.member.domain;

import com.bbusyeo.voida.api.member.constant.MemberValue;
import com.bbusyeo.voida.api.member.constant.QuickSlotDefault;
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

    public static MemberQuickSlot toDefaultQuickSlot(Member member, QuickSlotDefault quickSlotDefault) {
        return MemberQuickSlot.builder()
                .member(member)
                .hotkey(quickSlotDefault.hotkey())
                .url(MemberValue.S3_QUICK_SLOT_SOUND_DIR + quickSlotDefault.url())
                .message(quickSlotDefault.message())
                .build();
    }

    public void updateQuickSlot(String message, String hotkey, String url) {
        if (message != null) {
            this.message = message;
        }
        if (hotkey != null) {
            this.hotkey = hotkey;
        }
        if (url != null) {
            this.url = url;
        }
    }
}
