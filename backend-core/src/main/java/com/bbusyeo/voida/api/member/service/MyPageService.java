package com.bbusyeo.voida.api.member.service;

import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MyPageService {

    void updateIsNewbie(Long memberId);

    MeProfileResponseInfoDto getMeProfile(Member member);

    MeSettingResponseInfoDto getMeSetting(Long memberId);

    List<MeSocialAccountsInfoDto> getSocialAccounts(Long memberId);

    void createDefaultSettings(Member member);

    void updateProfile(UpdateMeProfileRequestDto requestDto, MultipartFile profileImage, Long memberId);

    boolean verifyPassword(Member member, String requestPassword);

    void changePassword(Long memberId, ChangePasswordRequestDto requestDto);

    void changeLipTalkMode(Long memberId, ChangeLipTalkRequestMode requestDto);

    void changeOverlay(Long memberId, ChangeOverlayRequestDto requestDto);

}
