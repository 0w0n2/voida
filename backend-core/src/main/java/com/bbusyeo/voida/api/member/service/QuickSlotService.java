package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.dto.ChangeQuickSlotsRequestDto;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsResponseInfoDto;

import java.util.List;

/**
 * 퀵슬롯(단축키) 관련 비즈니스 로직 처리하는 서비스 인터페이스
 */
public interface QuickSlotService {
    void changeQuickSlots(Long memberId, ChangeQuickSlotsRequestDto requestDto);

    List<MeQuickSlotsResponseInfoDto> getMeQuickSlots(Long memberId);
}
