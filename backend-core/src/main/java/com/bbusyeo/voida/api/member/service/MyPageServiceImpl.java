package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import com.bbusyeo.voida.api.member.domain.MemberSetting;
import com.bbusyeo.voida.api.member.dto.MeProfileResponseDto;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsResponseDto;
import com.bbusyeo.voida.api.member.dto.MeSettingResponseDto;
import com.bbusyeo.voida.api.member.repository.MemberQuickSlotRepository;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSettingRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MemberRepository memberRepository;
    private final MemberSettingRepository memberSettingRepository;
    private final MemberQuickSlotRepository memberQuickSlotRepository;

    @Transactional
    @Override
    public void updateIsNewbie(Long memberId){
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));
        member.changeIsNewbie(false);
    }

    @Override
    public MeProfileResponseDto getMeProfile(Member member) {
        return MeProfileResponseDto.toDto(member);
    }

    @Override
    public MeSettingResponseDto getMeSetting(Long memberId) {
        MemberSetting memberSetting = memberSettingRepository.findMemberSettingsByMemberId(memberId);
        return MeSettingResponseDto.toDto(memberSetting);
    }

    @Override
    public List<MeQuickSlotsResponseDto> getMeQuickSlots(Long memberId) {
        List<MemberQuickSlot> quickSlots = memberQuickSlotRepository.findMemberQuickSlotsByMemberId(memberId);

        return quickSlots.stream()
                .map(MeQuickSlotsResponseDto::toDto)
                .collect(Collectors.toList());
    }
}
