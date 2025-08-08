package com.bbusyeo.voida.global.security.handler;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;
import com.bbusyeo.voida.global.security.util.TokenUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Map;

@RequiredArgsConstructor
@Component
public class StompHandler implements ChannelInterceptor {

    private final TokenUtils tokenUtils;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // 최초 연결(Connect)시에 JWT 토큰 검증
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            // header에서 토큰 추출
            String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

            // token이 없거나 Bearer 타입 아니면 예외처리
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                throw new BaseException(BaseResponseStatus.TOKEN_NOT_FOUND);
            }

            String token = authorizationHeader.substring(7);

            // 토큰으로 authentication 객체 획득 (유효하지 않으면 TokenUtils에서 예외발생)
            Authentication authentication = tokenUtils.getAuthentication(token);

            // WebSocket 세션에 인증 정보 등록
            accessor.setUser(authentication);
            // 세션 속성에 Member 객체 저장
            UserDetailsDto userDetails = (UserDetailsDto) authentication.getPrincipal();
            Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
            if (sessionAttributes != null) {
                sessionAttributes.put("member", userDetails.getMember());
            }
        }
        return message;
    }
}
