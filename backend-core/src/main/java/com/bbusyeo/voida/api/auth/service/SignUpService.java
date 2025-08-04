package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.dto.SignUpRequestDto;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.support.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SignUpService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final Random random = new Random();

    private final S3Uploader s3Uploader;

    public void signUp(SignUpRequestDto requestDto, MultipartFile profileImage) {
        // 1. 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(requestDto.getPassword());

        // 2. memberUuid 생성
        String memberUuid = UUID.randomUUID().toString();

        // 3. 프로필 이미지 설정
        String profileImageUrl = null;
        try {
            final int DEFAULT_PROFILE_IMAGE_COUNT = 14;
            final String s3_PROFILE_DIR = "members/profiles";
            profileImageUrl = (profileImage != null && !profileImage.isEmpty()) ?
                    s3Uploader.upload(profileImage, s3_PROFILE_DIR) // 사용자 지정 이미지
                    : "%s/profile-images/default_%d.png".formatted(s3_PROFILE_DIR, random.nextInt(DEFAULT_PROFILE_IMAGE_COUNT)); // 디폴트 이미지

            // 4. member 테이블 저장
            Member member = memberRepository.save(requestDto.toMember(memberUuid, encodedPassword, profileImageUrl));

            // 5. 소셜 회원가입 처리
            if (Boolean.TRUE.equals(requestDto.getIsSocial())){
                // TODO: 소셜 테이블, 레포지토리 생성 후 -> 소셜 테이블에 저장
            }

        } catch (Exception e) {
            // 보상 트랜잭션: DB 저장 중 에러 발생 시, S3에 업로드된 파일이 있다면 삭제
            if (profileImageUrl != null && profileImage != null && !profileImage.isEmpty()) {
                s3Uploader.delete(profileImageUrl);
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
