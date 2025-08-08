package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import com.bbusyeo.voida.api.member.domain.MemberSetting;
import com.bbusyeo.voida.api.member.dto.MeProfileResponseInfoDto;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsResponseInfoDto;
import com.bbusyeo.voida.api.member.dto.MeSettingResponseInfoDto;
import com.bbusyeo.voida.api.member.dto.UpdateMeProfileRequestDto;
import com.bbusyeo.voida.api.member.repository.MemberQuickSlotRepository;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSettingRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.support.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MemberRepository memberRepository;
    private final MemberSettingRepository memberSettingRepository;
    private final MemberQuickSlotRepository memberQuickSlotRepository;
    private final S3Uploader s3Uploader;

    private final String S3_PROFILE_DIR = "members/profiles";

    @Transactional
    @Override
    public void updateIsNewbie(Long memberId){
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));
        member.changeIsNewbie(false);
    }

    @Override
    public MeProfileResponseInfoDto getMeProfile(Member member) {
        return MeProfileResponseInfoDto.toDto(member);
    }

    @Override
    public MeSettingResponseInfoDto getMeSetting(Long memberId) {
        MemberSetting memberSetting = memberSettingRepository.findMemberSettingsByMemberId(memberId);
        return MeSettingResponseInfoDto.toDto(memberSetting);
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
    public void updateProfile(UpdateMeProfileRequestDto requestDto, MultipartFile profileImage, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));
        String oldFileImageUrl = member.getProfileImageUrl();
        String newFileImageUrl = null;

        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                newFileImageUrl = s3Uploader.upload(profileImage, S3_PROFILE_DIR);
            }

            String finalImageUrl = (newFileImageUrl != null) ? newFileImageUrl : oldFileImageUrl;
            member.updateProfile(requestDto.getNickname(), finalImageUrl);

            if (newFileImageUrl != null && oldFileImageUrl != null
                    && !oldFileImageUrl.startsWith("%s/default_profile".formatted(S3_PROFILE_DIR))) {
                s3Uploader.delete(oldFileImageUrl);
            }
        }  catch (Exception e) {
            // --- 보상 트랜잭션 로직 ---
            // try 블록 내부 (S3 업로드/삭제 등)에서 예외 발생 시, @Transactional에 의해 DB 변경은 자동으로 롤백
            // S3 의 변경사항은 수동으로 처리
            if (newFileImageUrl != null) {
                s3Uploader.delete(newFileImageUrl);
            }
            // 원래 예외를 그대로 던지거나, BaseException 으로 감싸서 던짐
            if (e instanceof BaseException) {
                throw e;
            } else {
                throw new BaseException(BaseResponseStatus.DATABASE_CONSTRAINT_VIOLATION);
            }
        }

    }
}
