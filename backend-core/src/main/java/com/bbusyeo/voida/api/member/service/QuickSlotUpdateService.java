package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsRequestInfoDto;

import java.util.List;
import java.util.Map;

public interface QuickSlotUpdateService {
    void updateQuickSlotsInTransaction(
            List<MemberQuickSlot> memberQuickSlots,
            Map<Long, MeQuickSlotsRequestInfoDto> requestSlotMap,
            Map<Long, String> newSoundUrls
    );
}
