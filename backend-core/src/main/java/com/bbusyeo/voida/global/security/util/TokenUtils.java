package com.bbusyeo.voida.global.security.util;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.api.auth.domain.RefreshToken;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.service.UserDetailsServiceImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    private final UserDetailsService userDetailsService;
    private final MemberRepository memberRepository;

    public TokenUtils(@Value("${jwt.secret}") String secretKey, UserDetailsService userDetailsService, MemberRepository memberRepository) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        this.userDetailsService = userDetailsService;
        this.memberRepository = memberRepository;
    }

    public String createAccessToken(String subject, String authorities, Date expireDate) {
        return Jwts.builder()
                .subject(subject)                       // 토큰 제목
                .claim("auth", authorities)             // 권한 정보
                .expiration(expireDate)
                .issuedAt(new Date())
                .signWith(secretKey, Jwts.SIG.HS256)    // 지정된 키와 알고리즘으로 서명
                .compact();
    }

    public String createRefreshToken(String refreshTokenUuid, Date expireDate) {
        return Jwts.builder()
                .subject(refreshTokenUuid)
                .expiration(expireDate)
                .issuedAt(new Date())
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    // JWT 토큰 복호화 -> 검증 및 파싱 모두 수행
    public Claims parseClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // 토큰 정보 검증
    public boolean isTokenInvalid(String token) {
        if (!StringUtils.hasText(token)) {
            log.info("JWT token is null or empty");
            return true;
        }
        try {
            parseClaims(token);
            return false;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty", e);
        }
        return true;
    }

    public Collection<? extends GrantedAuthority> getAuthorities(String token) {
        String authClaim = parseClaims(token).get("auth").toString();
        return Arrays.stream(authClaim.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    // Request Header 에서 토큰 정보 추출
    public String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // JWT 토큰을 복호화하여 토큰에 들어있는 정보 꺼내기
    public Authentication getAuthentication(String accessToken) {
        Claims claims = parseClaims(accessToken);
        if (claims.get("auth") == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // Claim 에서 권한 정보 가져오기
        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .toList();

        // UserDetails 객체를 만들어서 Authentication return
        String memberUuid = claims.getSubject();
        UserDetails principal = memberRepository.findByMemberUuid(memberUuid)
                .map(UserDetailsDto::new)
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 사용자를 찾을 수 없습니다."));

        // UserDetails principal = new User(claims.getSubject(), "", authorities); // 사용자 식별자, credentials, 권한 목록
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    // 토큰에서 username 추출
    public String getSubjectFromToken(String token) {
        try {
            if (!StringUtils.hasText(token)) {
                throw new BaseException(BaseResponseStatus.TOKEN_NOT_FOUND);
            }
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload().getSubject(); // 사용자 이름(subject) 반환
        } catch (ExpiredJwtException e) {
            return e.getClaims().getSubject(); // 만료된 토큰에서도 클레임 내용 가져올 수 있음
        }
    }

}
