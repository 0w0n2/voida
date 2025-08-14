package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.dto.SignUpRequestDto;
import com.bbusyeo.voida.api.member.constant.MemberValue;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.MemberSocial;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSocialRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.constant.OAuth2Value;
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

    private final MemberSocialRepository memberSocialRepository;
    private final RedisDao redisDao;

    public Member signUp(SignUpRequestDto requestDto, MultipartFile profileImage) {
        if (requestDto.getNickname().length() > 10) {
            throw new BaseException(BaseResponseStatus.NICKNAME_TOO_LONG);
        }

        // 이전에 탈퇴한 회원의 재가입 시 기존 정보 제거
        memberRepository.findByEmailAndIsDeleted(requestDto.getEmail(), true)
                .ifPresent(member -> {
                    memberRepository.delete(member);
                    memberRepository.flush(); // 영속성 컨텍스트의 변경 내용을 DB에 반영
                })
        ;
        // 1. 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(requestDto.getPassword());

        // 2. memberUuid 생성
        String memberUuid = UUID.randomUUID().toString();

        // 3. 프로필 이미지 설정
        String profileImageUrl = null;
        try {
            profileImageUrl = (profileImage != null && !profileImage.isEmpty()) ?
                    s3Uploader.upload(profileImage, MemberValue.S3_PROFILE_DIR) // 사용자 지정 이미지
                    : "%s/default_profile%d.png".formatted(MemberValue.S3_PROFILE_DIR, random.nextInt(MemberValue.DEFAULT_PROFILE_IMAGE_COUNT) + 1); // 디폴트 이미지
            // 4. member 테이블 저장
            Member member = memberRepository.save(requestDto.toMember(memberUuid, encodedPassword, profileImageUrl));

            // 5. 소셜 회원가입 처리
            if (Boolean.TRUE.equals(requestDto.getIsSocial())) {
                // Redis 에서 임시 정보 가져오기
                String redisKey = OAuth2Value.SOCIAL_SIGNUP_TOKEN_PREFIX + requestDto.getEmail();
                Object providerId = redisDao.getValue(redisKey);
                if (providerId == null) { // 소셜 회원가입 시간 만료
                    throw new BaseException(BaseResponseStatus.EXPIRED_SOCIAL_SIGNUP);
                }

                MemberSocial memberSocial = requestDto.toMemberSocial(member, requestDto, providerId.toString());
                memberSocialRepository.save(memberSocial);

                redisDao.deleteValue(redisKey); // 사용 완료된 소셜 회원가입 데이터 삭제
            }

            return member;
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
