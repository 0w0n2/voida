package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsRequestInfoDto;

import java.util.List;
import java.util.Map;

/**
 * MemberQuickSlot 업데이트 시 DB 업데이트 트랜잭션을 담당하는 서비스 인터페이스
 */
public interface QuickSlotUpdateService {
    void updateQuickSlotsInTransaction(List<MemberQuickSlot> memberQuickSlots, Map<Long, MeQuickSlotsRequestInfoDto> requestSlotMap, Map<Long, String> newSoundUrls);
}
