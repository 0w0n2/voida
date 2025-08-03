package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.dto.CheckNicknameRequestDto;
import com.bbusyeo.voida.api.auth.dto.CheckNicknameResponseDto;
import com.bbusyeo.voida.api.auth.util.NicknameGenerator;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NicknameService {
    private final MemberRepository memberRepository;
    private final NicknameGenerator nicknameGenerator;

    public String getRandomNickname() {
        for (int i = 0; i < 10; i++) {
            String nickname = nicknameGenerator.generateNickname();
            if (!memberRepository.existsByNickname(nickname)) return nickname;
        }
        throw new BaseException(BaseResponseStatus.NICKNAME_GENERATION_FAILED);
    }

    public CheckNicknameResponseDto checkNickname(CheckNicknameRequestDto requestDto) {
        return CheckNicknameResponseDto.toDto(memberRepository.existsByNickname(requestDto.getNickname()));
    }
}
