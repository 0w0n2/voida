package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.dto.ChangeQuickSlotsRequestDto;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsResponseInfoDto;

import java.util.List;

/**
 * 퀵슬롯(단축키) 음성 생성 및 업로드 처리하는 서비스 인터페이스
 */
public interface QuickSlotService {
    // String generateAndUploadSound(String message);

    void changeQuickSlots(Long memberId, ChangeQuickSlotsRequestDto requestDto);

    void createDefaultQuickSlots(Member member);

    List<MeQuickSlotsResponseInfoDto> getMeQuickSlots(Long memberId);
}
