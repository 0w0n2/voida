package com.bbusyeo.voida.global.security.handler.oauth2;

import com.bbusyeo.voida.api.member.repository.MemberSocialRepository;
import com.bbusyeo.voida.global.redis.dao.RedisDao;
import com.bbusyeo.voida.global.security.constant.OAuth2Value;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.util.OAuth2Utils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

/**
 * 마이페이지 소셜 계정 추가 연동을 위한 서비스 로직
 */
@Component
@RequiredArgsConstructor
public class LinkAccountSuccessHandlerStrategy implements OAuth2SuccessHandlerStrategy {

    private final MemberSocialRepository memberSocialRepository;
    private final RedisDao redisDao;
    private final OAuth2Utils oAuth2Utils;

    @Value("${security.oauth.client-endpoint-link}")
    private String redirectUri;

    @Override
    public boolean supports(Authentication authentication, HttpServletRequest request) {
        return oAuth2Utils.isSocialLink(request);
    }

    @Transactional
    @Override
    public void handle(Authentication authentication, HttpServletRequest request, HttpServletResponse response) throws IOException {
        UserDetailsDto userDetailsDto = (UserDetailsDto) authentication.getPrincipal();
        memberSocialRepository.save(userDetailsDto.toMemberSocialForLinking());

        // 저장된 세션 및 redis 데이터 제거
        HttpSession session = request.getSession(false);
        redisDao.deleteValue(OAuth2Value.SOCIAL_LINK_TOKEN_PREFIX + session.getAttribute(OAuth2Value.SOCIAL_LINK_SESSION_TOKEN_NAME).toString());
        session.removeAttribute(OAuth2Value.SOCIAL_LINK_SESSION_NAME);
        session.removeAttribute(OAuth2Value.SOCIAL_LINK_SESSION_TOKEN_NAME);

        // 프론트 지정 경로(마이페이지)로 리다이렉션
        response.setStatus(HttpServletResponse.SC_FOUND); // 302
        response.setHeader("Location", redirectUri);
    }
}
