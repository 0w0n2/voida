package com.bbusyeo.voida.api.auth.service;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.auth.domain.VerificationCode;
import com.bbusyeo.voida.api.auth.dto.*;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.auth.util.NicknameGenerator;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.service.JwtTokenService;
import com.bbusyeo.voida.global.security.service.TokenBlackListService;
import com.bbusyeo.voida.global.security.util.CookieUtils;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import com.bbusyeo.voida.global.support.S3Uploader;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final NicknameService nicknameService;
    private final ResetPasswordService resetPasswordService;

    private final TokenUtils tokenUtils;
    private final CookieUtils cookieUtils;

    private final RedisDao redisDao;
    private final TokenBlackListService tokenBlackListService;
    private final AuthenticationProvider authenticationProvider;
    private final JwtTokenService jwtTokenService;
    private final MemberRepository memberRepository;

    private final S3Uploader s3Uploader;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final String SIGNUP_CODE_PREFIX = "signup-code:";
    private final String S3_PROFILE_DIR = "members/profiles";
    private final int DEFAULT_PROFILE_IMAGE_COUNT = 14;

    @Value("${jwt.expire-time.refresh}")
    private Duration refreshExpMin;

    private final Duration signUpMailCodeExpMin = Duration.ofMinutes(5);

    @Override
    public SignInResponseDto signIn(SignInRequestDto requestDto, HttpServletResponse response) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(requestDto.getEmail(), requestDto.getPassword());

        // 인증 정보 기반으로 JWT token 생성
        Authentication authentication = authenticationProvider.authenticate(authenticationToken);
        UserDetailsDto userDetails = (UserDetailsDto) authentication.getPrincipal();
        JwtToken jwtToken = jwtTokenService.generateToken(userDetails);

        // Access Token -> Header
        response.addHeader("Authorization", "Bearer " + jwtToken.getAccessToken());
        // Refresh Token -> Cookie
        cookieUtils.setRefreshCookie(response, jwtToken.getRefreshToken(), (int) refreshExpMin.getSeconds());

        // member 정보 모두 조회
        Member member = userDetails.getMember();

        return SignInResponseDto.toDto(member);
    }

    @Override
    public void refreshAccessToken(String refreshToken, HttpServletResponse response) {
        JwtToken newTokens = jwtTokenService.reissue(refreshToken);

        // 이전에 사용하던 토큰들을 블랙리스트에 저장
        tokenBlackListService.addBlacklistRefresh(refreshToken);

        response.setHeader("Authorization", "Bearer " + newTokens.getAccessToken());
        cookieUtils.setRefreshCookie(response, newTokens.getRefreshToken(), (int) refreshExpMin.getSeconds());
    }


    @Override
    public void signOut(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = tokenUtils.getTokenFromRequest(request);

        String memberUuid = tokenUtils.getSubjectFromToken(accessToken); // AccessToken 에서 username 파싱(email)
        jwtTokenService.deleteRefreshToken(memberUuid); // Redis 에 저장된 refresh Token 삭제

        tokenBlackListService.addBlacklistAccess(accessToken); // AccessToken 을 Redis 에 블랙리스트로 저장

        cookieUtils.setRefreshCookie(response, "", 0); // Refresh Token 쿠키 만료 처리
    }

    @Override
    public VerificationCode generateVerificationCode(String email) {
        String code = UUID.randomUUID().toString().substring(0, 6);

        String redisKey = SIGNUP_CODE_PREFIX + email;
        redisDao.setValue(redisKey, code, signUpMailCodeExpMin); // value: signup-code:email, key: code(UUID)

        String expiredAt = LocalDateTime.now().plus(signUpMailCodeExpMin)
                .format(DateTimeFormatter.ISO_DATE_TIME);

        return VerificationCode.builder()
                .code(code)
                .expiredAt(expiredAt).build();
    }

    @Override
    public VerifyEmailResponseDto verifyEmailCode(VerifyEmailRequestDto requestDto) {
        String redisKey = SIGNUP_CODE_PREFIX + requestDto.getEmail();
        Object redisCode = redisDao.getValue(redisKey);
        if (redisCode == null) { // redis 에 key 존재 X -> TTL 완료
            return VerifyEmailResponseDto.toDto(false, true); // 만료 O
        }
        boolean isMatch = redisCode.toString().equals(requestDto.getCode());
        return VerifyEmailResponseDto.toDto(isMatch, false);
    }

    @Override
    public CheckNicknameResponseDto checkNickname(CheckNicknameRequestDto requestDto) {
        return CheckNicknameResponseDto.toDto(memberRepository.existsByNickname(requestDto.getNickname()));
    }

    @Override
    public RandomNicknameResponseDto getRandomNickname() {
        return RandomNicknameResponseDto.toDto(nicknameService.getRandomNickname());
    }

    @Override
    public void signUp(SignUpRequestDto requestDto, MultipartFile profileImage) {
        // 1. 닉네임, 이메일 중복 여부 한 번 더 체크
        if (memberRepository.existsByEmail(requestDto.getEmail()))
            throw new BaseException(BaseResponseStatus.DUPLICATE_EMAIL);
        if (memberRepository.existsByNickname(requestDto.getNickname()))
            throw new BaseException(BaseResponseStatus.DUPLICATE_NICKNAME);

        // 2. 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(requestDto.getPassword());
        
        // 3. memberUuid 생성
        String memberUuid = generateUniqueMemberUuid();
        
        // 4. 프로필 이미지 설정
        String profileImageUrl = null;
        try {
            profileImageUrl = (profileImage != null && !profileImage.isEmpty()) ?
                    s3Uploader.upload(profileImage, S3_PROFILE_DIR) // 사용자 지정 이미지
                        : "%s/profile-images/default_%d.png".formatted(S3_PROFILE_DIR, random.nextInt(DEFAULT_PROFILE_IMAGE_COUNT)); // 디폴트 이미지
            
            // 5. member 테이블 저장
            Member member = memberRepository.save(requestDto.toMember(memberUuid, encodedPassword, profileImageUrl));
            
            // 6. 소셜 회원가입 처리
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

    private final Random random = new Random();

    private String generateUniqueMemberUuid() {
        // 3. memberUuid 생성
        String memberUuid;
        do {
            memberUuid = UUID.randomUUID().toString();
        } while (memberRepository.existsByMemberUuid(memberUuid));
        return memberUuid;
    }

    @Override
    public String resetPassword(ResetPasswordRequestDto requestDto) {
        return resetPasswordService.resetPassword(requestDto);
    }
}
