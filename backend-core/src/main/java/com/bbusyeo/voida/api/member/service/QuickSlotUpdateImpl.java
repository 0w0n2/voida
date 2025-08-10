package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsRequestInfoDto;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.support.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class QuickSlotUpdateImpl implements QuickSlotUpdateService {

    private final S3Uploader s3Uploader;

    // DB 업데이트 전용 트랜잭션 메소드
    @Override
    @Transactional
    public void updateQuickSlotsInTransaction(
            List<MemberQuickSlot> memberQuickSlots,
            Map<Long, MeQuickSlotsRequestInfoDto> requestSlotMap,
            Map<Long, String> newSoundUrls
    ) {
        for (MemberQuickSlot quickSlot : memberQuickSlots) {
            MeQuickSlotsRequestInfoDto requestSlot = requestSlotMap.get(quickSlot.getId());

            if (requestSlot != null) {
                String finalSoundUrl = quickSlot.getUrl(); // 기존 URL로 초기화
                // 새로 업로드된 URL이 있다면 업데이트
                if (!newSoundUrls.containsKey(quickSlot.getId())) {
                    finalSoundUrl = newSoundUrls.get(quickSlot.getId());
                    // 기존 파일은 DB 업데이트 성공 후 삭제
                    String oldSoundUrl = quickSlot.getUrl();
                    if (oldSoundUrl != null && !oldSoundUrl.contains("default")) {
                        s3Uploader.delete(oldSoundUrl); // DB 변경 후 삭제
                    }
                } // DB 엔티티 업데이트
                quickSlot.updateQuickSlot(requestSlot.getMessage(), requestSlot.getHotkey(), finalSoundUrl);
            } else {
                throw new BaseException(BaseResponseStatus.INVALID_QUICK_SLOT_ID);
            }
        }
    }
}
