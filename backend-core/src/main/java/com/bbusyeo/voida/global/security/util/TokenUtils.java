package com.bbusyeo.voida.global.security.util;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

/**
 * JWT 토큰 생성/파싱/검증 담당 유틸
 */
@Component
@Slf4j
public class TokenUtils {

    private final SecretKey secretKey;
    private final RedisDao redisDao;
    private final UserDetailsService userDetailsService;

    private static final String GRANT_TYPE = "Bearer";

    @Value("${jwt.expire-time.access}")
    private Duration accessExpMin;

    @Value("${jwt.expire-time.refresh}")
    private Duration refreshExpMin;

    public TokenUtils(@Value("${jwt.secret}") String secretKey, // application.yaml 에서 secret 값 추출
                      RedisDao redisDao, UserDetailsService userDetailsService) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.redisDao = redisDao;
        this.userDetailsService = userDetailsService;
    }

    // 사용자 정보(Member) 정보로 AccessToken & RefreshToken 생성
    public JwtToken generateToken(Authentication authentication) {
        // JWT 토큰의 claims 에 포함되어 사용자의 권한 정보를 저장하는데 사용됨
        String authorities = authentication.getAuthorities().stream() // Authentication 객체에서 사용자 권한 목록 가져오기
                .map(GrantedAuthority::getAuthority) // 각 GrantedAuthority 객체에서 권한 문자열만 추출하기
                .collect(Collectors.joining(",")); // 추출된 권한 문자열들은 쉼표로 구분하여 하나의 문자열로 결합

        long now = (new Date()).getTime();
        String username = authentication.getName();

        UserDetailsDto userDetails = (UserDetailsDto) authentication.getPrincipal();
        String memberId =  userDetails.getMemberUuid();

        // Access Token 생성
        Date accessTokenExpireTime = new Date(now + accessExpMin.toMillis());
        String accessToken = generateAccessToken(username, authorities, accessTokenExpireTime);

        // Refresh Token 생성
        Date refreshTokenExpireTime = new Date(now + refreshExpMin.toMillis());
        String refreshToken = generateRefreshToken(username, refreshTokenExpireTime);

        // redis에 RefreshToken 넣기
        // 나중에 memberId로 변경
        redisDao.setValue(username, refreshToken, refreshExpMin);

        return JwtToken.builder()
                .grantType(GRANT_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    private String generateAccessToken(String username, String authorities, Date expireDate) {
        return Jwts.builder()
                .subject(username) // 토큰 제목 (사용자 이름)
                .claim("auth", authorities) // 권한 정보
                .expiration(expireDate)
                .signWith(secretKey, Jwts.SIG.HS256) // 지정된 키와 알고리즘으로 서명
                .compact(); // 최종 JWT 문자열 생성 (header.payload.signature 구조)
    }

    private String generateRefreshToken(String username, Date expireDate) {

        return Jwts.builder()
                .subject(username)
                .expiration(expireDate)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public JwtToken generateTokenWithRefreshToken(String username){
        long now = (new Date()).getTime();
        // AccessToken 생성
        Date accessTokenExpireTime = new Date(now + refreshExpMin.toMillis());

        // UserDetailsService로 사용자 권한 정보 가져오기
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        String accessToken = generateAccessToken(username, authorities, accessTokenExpireTime);

        // RefreshToken 생성
        Date refreshTokenExpireTime = new Date(now + accessExpMin.toMillis());
        String refreshToken = generateRefreshToken(authorities, refreshTokenExpireTime);

        // 다시 발급한 RefreshToken을 Redis에 저장하기
        redisDao.setValue(username, refreshToken, refreshExpMin);

        return JwtToken.builder()
                .grantType(GRANT_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken).build();
    }
    
    // JWT 토큰을 복호화하여 토큰에 들어있는 정보 꺼내기
    public Authentication getAuthentication(String accessToken) {
        Claims claims = parseClaims(accessToken);
        if (claims.get("auth") == null){
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // Claim 에서 권한 정보 가져오기
        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .toList();

        // UserDetails 객체를 만들어서 Authentication return
        UserDetails principal = new User(claims.getSubject(), "", authorities); // 사용자 식별자, credentials, 권한 목록
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }
    
    // JWT 토큰 복호화 -> 검증 및 파싱 모두 수행
    public Claims parseClaims(String accessToken) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(accessToken)
                    .getPayload();
        } catch (ExpiredJwtException e){
            return e.getClaims();
        }
    }

    // 토큰 정보 검증
    public boolean validateToken(String token) {
        if (!StringUtils.hasText(token)){
            log.info("JWT token is null or empty");
            return false;
        }
        try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e){
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e){
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e){
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e){
            log.info("JWT claims string is empty", e);
        }
        return false;
    }
    
    // RefreshToken 검증
    public boolean validateRefreshToken(String token){
        if (!validateToken(token)) return false; // 1차 유효 검증
        try {
            String username = getUserNameFromToken(token);
            String redisToken = (String) redisDao.getValue(username);
            return token.equals(redisToken);
        } catch (Exception e){
            log.info("RefreshToken Validation Failed", e);
            return false;
        }
    }
    
    // 토큰에서 username 추출
    public String getUserNameFromToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload().getSubject(); // 사용자 이름(subject) 반환
        } catch (ExpiredJwtException e){
            return e.getClaims().getSubject(); // 만료된 토큰에서도 클레임 내용 가져올 수 있음
        }
    }

    // RefreshToken 삭제
    public void deleteRefreshToken(String username) {
        if (username==null || username.trim().isEmpty()){
            throw new IllegalArgumentException("Username cannot be null or empty.");
        }
        redisDao.deleteValue(username); // 로그아웃 시 Redis 에서 RefreshToken 삭제
    }

}
