package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.dto.MeProfileResponseDto;
import com.bbusyeo.voida.api.member.dto.MeSettingResponseDto;

public interface MyPageService {

    void updateIsNewbie(Long memberId);

    MeProfileResponseDto getMeProfile(Member member);

    MeSettingResponseDto getMeSetting(Long memberId);
}
