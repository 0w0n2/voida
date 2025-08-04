package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.dto.ResetPasswordRequestDto;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class ResetPasswordService {

    private final SecureRandom random = new SecureRandom();
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public String resetPassword(ResetPasswordRequestDto requestDto) {
        // 1. 멤버 조회
        Member member = memberRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));

        // 2. 임시 비밀번호 생성
        char[] charSet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@!&#".toCharArray();
        StringBuilder tempPw = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            tempPw.append(charSet[random.nextInt(charSet.length)]);
        }

        // 3. 임시 비밀번호 인코딩 후 업데이트
        String encodedPw = bCryptPasswordEncoder.encode(tempPw.toString());
        member.changePassword(encodedPw);
        memberRepository.save(member);

        // 4. 임시 비밀번호 반환
        return tempPw.toString();
    }
}
