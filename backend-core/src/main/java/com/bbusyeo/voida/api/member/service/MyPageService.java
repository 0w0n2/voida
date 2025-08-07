package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.dto.MeProfileResponseDto;
import com.bbusyeo.voida.api.member.dto.MeQuickSlotsResponseDto;
import com.bbusyeo.voida.api.member.dto.MeSettingResponseDto;

import java.util.List;

public interface MyPageService {

    void updateIsNewbie(Long memberId);

    MeProfileResponseDto getMeProfile(Member member);

    MeSettingResponseDto getMeSetting(Long memberId);

    List<MeQuickSlotsResponseDto> getMeQuickSlots(Long memberId);
}
