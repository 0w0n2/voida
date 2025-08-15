package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.constant.MemberValue;
import com.bbusyeo.voida.api.member.constant.QuickSlotDefault;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import com.bbusyeo.voida.api.member.domain.MemberSetting;
import com.bbusyeo.voida.api.member.domain.MemberSocial;
import com.bbusyeo.voida.api.member.dto.*;
import com.bbusyeo.voida.api.member.repository.MemberQuickSlotRepository;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSettingRepository;
import com.bbusyeo.voida.api.member.repository.MemberSocialRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.support.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MemberRepository memberRepository;
    private final MemberSettingRepository memberSettingRepository;
    private final MemberQuickSlotRepository memberQuickSlotRepository;
    private final S3Uploader s3Uploader;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final MemberSocialRepository memberSocialRepository;

    @Transactional
    @Override
    public void updateIsNewbie(Long memberId) {
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
        return MeSettingResponseInfoDto.toDto(
                memberSettingRepository.findMemberSettingsByMemberId(memberId)
                        .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_SETTING_NOT_FOUND)));
    }

    @Override
    public List<MeSocialAccountsInfoDto> getSocialAccounts(Long memberId) {
        List<MemberSocial> socialAccounts = memberSocialRepository.findMemberSocialsByMemberId(memberId);

        return socialAccounts.stream()
                .map(MeSocialAccountsInfoDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void checkNicknameIsValid(String nickname) {
        if (memberRepository.existsByNicknameAndIsDeletedIsFalse(nickname)) {
            throw new BaseException(BaseResponseStatus.NICKNAME_IS_DUPLICATED);
        }
        if (nickname.length() > 10) {
            throw new BaseException(BaseResponseStatus.NICKNAME_TOO_LONG);
        }
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
                newFileImageUrl = s3Uploader.upload(profileImage, MemberValue.S3_PROFILE_DIR);
            }

            String finalImageUrl = (newFileImageUrl != null) ? newFileImageUrl : oldFileImageUrl;
            member.updateProfile(requestDto.getNickname(), finalImageUrl);

            if (newFileImageUrl != null && oldFileImageUrl != null
                    && !oldFileImageUrl.startsWith("%s/default_profile".formatted(MemberValue.S3_PROFILE_DIR))) {
                s3Uploader.delete(oldFileImageUrl);
            }
        } catch (Exception e) {
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

    @Transactional
    @Override
    public void createDefaultSettingsAndQuickSlots(Member member) {
        // 디폴트 member_setting 등록
        MemberSetting defaultSetting = MemberSetting.toDefaultSetting(member);
        memberSettingRepository.save(defaultSetting);

        // 디폴트 member_quick_slot 등록
        List<QuickSlotDefault> defaultSlots = MemberValue.DEFAULT_QUICK_SLOT_DEFAULTS;
        for (QuickSlotDefault quickSlotDefault : defaultSlots) {
            memberQuickSlotRepository.save(MemberQuickSlot.toDefaultQuickSlot(member, quickSlotDefault));
        }
    }

    @Override
    public boolean verifyPassword(Member member, String requestPassword) {
        return bCryptPasswordEncoder.matches(requestPassword, member.getPassword());
    }

    @Transactional
    @Override
    public void changePassword(Long memberId, ChangePasswordRequestDto requestDto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));

        // 2차 검증 (최종적으로 넘어온 이전 비밀번호가 현재 DB와 일치하는지)
        if (!bCryptPasswordEncoder.matches(requestDto.getCurrentPassword(), member.getPassword())) {
            throw new BaseException(BaseResponseStatus.MISMATCH_PASSWORD);
        }

        String encodedPw = bCryptPasswordEncoder.encode(requestDto.getNewPassword());
        member.changePassword(encodedPw);
    }

    @Transactional
    @Override
    public void changeLipTalkMode(Long memberId, ChangeLipTalkRequestMode requestDto) {
        MemberSetting memberSetting = memberSettingRepository.findMemberSettingsByMemberId(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_SETTING_NOT_FOUND));
        memberSetting.changeLipTalkMode(requestDto.getUseLipTalkMode());
    }

    @Transactional
    @Override
    public void changeOverlay(Long memberId, ChangeOverlayRequestDto requestDto) {
        MemberSetting memberSetting = memberSettingRepository.findMemberSettingsByMemberId(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_SETTING_NOT_FOUND));
        memberSetting.changeOverlayPosition(requestDto.getOverlayPosition(), requestDto.getLiveFontSize(), requestDto.getOverlayTransparency());
    }
}
