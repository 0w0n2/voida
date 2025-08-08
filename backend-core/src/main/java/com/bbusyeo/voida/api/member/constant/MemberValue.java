package com.bbusyeo.voida.api.member.constant;

import com.bbusyeo.voida.api.member.domain.enums.OverlayPosition;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
public final class MemberValue {

    // member_setting 기본값
    public static final boolean DEFAULT_LIP_TALK_MODE = false;
    public static final OverlayPosition DEFAULT_OVERLAY_POSITION = OverlayPosition.TOPRIGHT;
    public static final int DEFAULT_LIVE_FONT_SIZE = 14;
    public static final int DEFAULT_OVERLAY_TRANSPARENCY = 50;
    
    // TODO-MEMBER: 음성 파일 S3 경로, hotkey 이후 최종본으로 수정 필요
    // member_quick_slot 기본값
    public static final List<QuickSlotDefault> DEFAULT_QUICK_SLOT_DEFAULTS = List.of(
            new QuickSlotDefault("안녕하세요.", "/default_hello.mp3", "`1"),
            new QuickSlotDefault("감사합니다.", "/default_thanks.mp3", "`2"),
            new QuickSlotDefault("도움이 필요합니다.", "/default_help.mp3", "`3"),
            new QuickSlotDefault("잠시만 기다려주세요.", "/default_wait.mp3", "`4"),
            new QuickSlotDefault("죄송합니다.", "default_sorry.mp3", "`5"),
            new QuickSlotDefault("좋은 하루 되세요.", "default_good_luck.mp3", "`6")
    );
    
    // S3 경로
    public static final String S3_QUICK_SLOT_SOUND_DIR = "members/quick-slots";
    public static final String S3_PROFILE_DIR = "members/profiles";
    public static final int DEFAULT_PROFILE_IMAGE_COUNT = 14;
}
