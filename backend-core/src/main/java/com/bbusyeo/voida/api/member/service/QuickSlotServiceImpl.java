package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.constant.MemberValue;
import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
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
    private final QuickSlotUpdateService quickSlotUpdateService;
    
    // 퀵슬롯 수정 담당
    @Override
    public void changeQuickSlots(Long memberId, ChangeQuickSlotsRequestDto requestDto) {
        // 퀵슬롯 ID와 요청 DTO를 매핑하는 Map 생성
        Map<Long, MeQuickSlotsRequestInfoDto> requestSlotMap = requestDto.getQuickSlots()
                .stream()
                .collect(Collectors.toMap(MeQuickSlotsRequestInfoDto::getQuickSlotId, Function.identity()));

        // 요청 DTO에 포함된 퀵슬롯 리스트
        List<MemberQuickSlot> memberQuickSlots = memberQuickSlotRepository.findMemberQuickSlotsByMemberId(memberId);

        // 변경된 메시지에 대한 TTS 파일 생성 및 URL 맵
        Map<Long, String> newSoundUrls = new HashMap<>();

        // S3 업로드 실패 시 보상 트랜잭션을 위한 임시 URL 리스트
        List<String> uploadedUrls = new ArrayList<>();

        for (MemberQuickSlot quickSlot  : memberQuickSlots) {
            MeQuickSlotsRequestInfoDto requestSlot = requestSlotMap.get(quickSlot.getId());

            if (requestSlot != null) { // 메시지 변경되었을 경우 파일 업로드
                if (!quickSlot.getMessage().equals(requestSlot.getMessage())) { // 메시지 변경됐을 경우 TTS 생성 및 업로드 후 URL 리턴
                    try {
                        String newUrl = generateAndUploadSound(requestSlot.getMessage());
                        newSoundUrls.put(quickSlot.getId(), newUrl);
                        uploadedUrls.add(newUrl);
                    } catch (Exception e) { // S3 업로드 실패 시 파일 삭제
                        uploadedUrls.forEach(s3Uploader::delete);
                        throw new BaseException(BaseResponseStatus.FILE_UPLOAD_FAILED);
                    }
                }
            }
        }

        // 파일 업로드 모두 성공 후 DB 업데이트를 위한 별도의 트랜잭션 메소드 호출
        try {
            quickSlotUpdateService.updateQuickSlotsInTransaction(memberQuickSlots, requestSlotMap, newSoundUrls);
        } catch (BaseException e) {
            uploadedUrls.forEach(s3Uploader::delete);
            throw e;
        }
    }

    @Override
    public List<MeQuickSlotsResponseInfoDto> getMeQuickSlots(Long memberId) {
        List<MemberQuickSlot> quickSlots = memberQuickSlotRepository.findMemberQuickSlotsByMemberId(memberId);

        return quickSlots.stream()
                .map(MeQuickSlotsResponseInfoDto::toDto)
                .collect(Collectors.toList());
    }
    
    // message 문자열을 입력 받아 TTS 로 변환하고, S3에 업로드
    private String generateAndUploadSound(String message) {
        MultipartFile ttsAudioData = ttsService.createSpeechByText(message).block();    // TTS 를 통해 음성 파일 테이터 생성
        return s3Uploader.upload(ttsAudioData, MemberValue.S3_QUICK_SLOT_SOUND_DIR);    // S3에 음성 파일 업로드 후 URL 반환
    }

    // S3 업로드 및 기존 데이터 삭제 담당 메소드
    private String handleSoundFileUpdate(MemberQuickSlot memberQuickSlot, String newMessage) {
        String oldSoundUrl = memberQuickSlot.getUrl();
        String newSoundUrl = null;
        try {
            newSoundUrl = generateAndUploadSound(newMessage); // 새 파일 업로드
            if (oldSoundUrl != null && !oldSoundUrl.contains("default")) { // 기본 사운드가 아닐 경우 기존 음성 삭제
                s3Uploader.delete(oldSoundUrl);
            }
            return newSoundUrl;
        } catch (Exception e) { // 보상 트랜잭션 로직 : 실패 시 새로 업로드한 파일이 있다면 삭제
            if (newSoundUrl != null) {
                s3Uploader.delete(newSoundUrl);
            }
            if (e instanceof BaseException) {
                throw e;
            } else {
                throw new BaseException(BaseResponseStatus.FILE_UPLOAD_FAILED);
            }
        }
    }
}
