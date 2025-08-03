package com.bbusyeo.voida.global.security.service;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtTokenServiceImpl implements JwtTokenService {

    private final TokenUtils tokenUtils;
    private final RedisDao redisDao;
    private final MemberRepository memberRepository;
    private final TokenBlackListService tokenBlackListService;

    @Value("${jwt.expire-time.access}")
    private Duration accessExpMin;

    @Value("${jwt.expire-time.refresh}")
    private Duration refreshExpMin;

    private static final String GRANT_TYPE = "Bearer";

    private static final String REFRESH_PREFIX = "jwt-rt:";
    private static final String REFRESH_MAPPING_PREFIX = "member-rt:";

    // 사용자 정보(Member) 정보로 AccessToken & RefreshToken 생성
    @Override
    public JwtToken generateToken(UserDetailsDto userDetails) {

        long now = (new Date()).getTime();

        String memberUuid = userDetails.getMemberUuid();
        String authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        // Access Token 생성
        Date accessExpAt = new Date(now + accessExpMin.toMillis());
        String accessToken = tokenUtils.createAccessToken(memberUuid, authorities, accessExpAt);

        // Refresh Token 생성
        Date refreshExpAt = new Date(now + refreshExpMin.toMillis());
        String refreshTokenUuid = UUID.randomUUID().toString();
        String refreshToken = tokenUtils.createRefreshToken(refreshTokenUuid, refreshExpAt);

        redisDao.setValue(REFRESH_PREFIX + refreshTokenUuid, memberUuid, refreshExpMin);
        redisDao.setValue(REFRESH_MAPPING_PREFIX + memberUuid, refreshTokenUuid, refreshExpMin);

        return JwtToken.builder()
                .grantType(GRANT_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public JwtToken reissue(String refreshToken) {
        if (tokenUtils.isTokenInvalid(refreshToken)
                || tokenBlackListService.isBlacklistedRefresh(refreshToken)) {
            throw new BaseException(BaseResponseStatus.REFRESH_TOKEN_INVALID);
        }

        // 토큰 subject 에서 refreshUuid 추출
        String refreshUuid = tokenUtils.getSubjectFromToken(refreshToken);

        // Redis 에서 memberUuid 확인
        String redisKey = REFRESH_PREFIX + refreshUuid;
        String redisMemberUuid = Optional.ofNullable(redisDao.getValue(redisKey))
                .map(Object::toString)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.INVALID_JWT_TOKEN));

        // 사용자 정보 조회
        Member member = memberRepository.findByMemberUuid(redisMemberUuid)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.INVALID_JWT_TOKEN));
        UserDetailsDto userDetails = new UserDetailsDto(member);

        // AccessToken 재발급
        long now = (new Date()).getTime();
        Date accessTokenExpireTime = new Date(now + accessExpMin.toMillis());
        String authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        String newAccessToken = tokenUtils.createAccessToken(userDetails.getMemberUuid(), authorities, accessTokenExpireTime);

        // RefreshToken 재발급
        Date refreshTokenExpireTime = new Date(now + refreshExpMin.toMillis());
        String newRefreshUuid = UUID.randomUUID().toString();
        String newRefreshToken = tokenUtils.createRefreshToken(newRefreshUuid, refreshTokenExpireTime);

        // Redis 저장
        redisDao.deleteValue(redisKey); // 기존 RefreshToken 폐기
        redisDao.deleteValue(REFRESH_MAPPING_PREFIX + userDetails.getMemberUuid());
        redisDao.setValue(REFRESH_PREFIX + newRefreshUuid, userDetails.getMemberUuid(), refreshExpMin);
        redisDao.setValue(REFRESH_MAPPING_PREFIX + userDetails.getMemberUuid(), newRefreshUuid, refreshExpMin);

        return JwtToken.builder()
                .grantType(GRANT_TYPE)
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken).build();
    }

    // RefreshToken 삭제
    @Override
    public void deleteRefreshToken(String memberUuid) {
        if (!StringUtils.hasText(memberUuid)) {
            throw new BaseException(BaseResponseStatus.TOKEN_USERNAME_NOT_FOUND);
        }
        String refreshUuid = (String) redisDao.getValue(REFRESH_MAPPING_PREFIX + memberUuid);
        if (refreshUuid != null) {
            redisDao.deleteValue(REFRESH_PREFIX + refreshUuid);
            redisDao.deleteValue(REFRESH_MAPPING_PREFIX + memberUuid);
        }
    }
}
