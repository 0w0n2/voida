package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.constant.MemberValue;
import com.bbusyeo.voida.api.member.constant.QuickSlotDefault;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import com.bbusyeo.voida.api.member.domain.MemberSetting;
import com.bbusyeo.voida.api.member.dto.ChangeQuickSlotsRequestDto;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsRequestInfoDto;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsResponseInfoDto;
import com.bbusyeo.voida.api.member.repository.MemberQuickSlotRepository;
import com.bbusyeo.voida.global.ai.tts.TtsService;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.support.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuickSlotServiceImpl implements QuickSlotService {

    private final TtsService ttsService;
    private final S3Uploader s3Uploader;
    private final MemberQuickSlotRepository memberQuickSlotRepository;

    private String generateAndUploadSound(String message) {
        // TTS 를 통해 음성 파일 테이터 생성
        MultipartFile ttsAudioData = ttsService.createSpeechByText(message).block();
        // S3에 음성 파일 업로드 후 URL 반환
        return s3Uploader.upload(ttsAudioData, MemberValue.S3_QUICK_SLOT_SOUND_DIR);
    }

    @Transactional
    @Override
    public void changeQuickSlots(Long memberId, ChangeQuickSlotsRequestDto requestDto) {
        // 사용자의 모든 퀵슬롯을 quickSlotId를 키로 하는 Map 생성
        Map<Long, MemberQuickSlot> quickSlotMap = memberQuickSlotRepository.findMemberQuickSlotsByMemberId(memberId)
                .stream()
                .collect(Collectors.toMap(MemberQuickSlot::getId, Function.identity()));

        // 요청 DTO에 포함된 퀵슬롯 리스트
        List<MeQuickSlotsRequestInfoDto> requestSlots = requestDto.getQuickSlots();

        for (MeQuickSlotsRequestInfoDto slotDto : requestSlots) {
            MemberQuickSlot memberQuickSlot = quickSlotMap.get(slotDto.getQuickSlotId());

            if (memberQuickSlot != null) {
                String newSoundUrl = memberQuickSlot.getUrl(); // 기존 URL로 초기화
                if (!memberQuickSlot.getMessage().equals(slotDto.getMessage())) { // 음성 생성 및 업로드 후 URL 리턴
                    newSoundUrl = generateAndUploadSound(slotDto.getMessage());
                }
                memberQuickSlot.updateQuickSlot(slotDto.getMessage(), slotDto.getHotkey(), newSoundUrl);
            } else {
                throw new BaseException(BaseResponseStatus.INVALID_QUICK_SLOT_ID);
            }
        }
    }

    @Override
    public List<MeQuickSlotsResponseInfoDto> getMeQuickSlots(Long memberId) {
        List<MemberQuickSlot> quickSlots = memberQuickSlotRepository.findMemberQuickSlotsByMemberId(memberId);

        return quickSlots.stream()
                .map(MeQuickSlotsResponseInfoDto::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void createDefaultQuickSlots(Member member) { // 디폴트 member_quick_slot 등록
        List<QuickSlotDefault> defaultSlots = MemberValue.DEFAULT_QUICK_SLOT_DEFAULTS;
        for (QuickSlotDefault quickSlotDefault : defaultSlots) {
            memberQuickSlotRepository.save(MemberQuickSlot.toDefaultQuickSlot(member, quickSlotDefault));
        }
    }
}
