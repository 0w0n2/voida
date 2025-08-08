package com.bbusyeo.voida.global.config;

import com.bbusyeo.voida.global.security.config.CorsProperties;
import com.bbusyeo.voida.global.security.handler.StompHandler;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@EnableConfigurationProperties({CorsProperties.class})
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;
    private final CorsProperties corsProperties;

    public WebSocketConfig(StompHandler stompHandler, CorsProperties corsProperties) {
        this.stompHandler = stompHandler;
        this.corsProperties = corsProperties;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry  registry) {
        // WebSocket이 웹소켓 핸드셰이킹 커넥션을 생성할 경로 (연결 시작할 엔드포인트)
        registry.addEndpoint("/ws")
                // todo: 프론트엔드 배포 주소로 변경 예정 , yaml로 관리하기 (properties 관리)
                .setAllowedOrigins(corsProperties.getAllowedOrigins().toArray(String[]::new))
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /sub로 시작하는 주소를 구독하는 member들에게 메시지 전달
        registry.enableSimpleBroker("/sub");
        // /pub로 시작하는 주소로 member가 메시지 보내면 서버의 @MessageMapping 메서드로 라우팅
        registry.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Controller에 가기전에 stompHandler를 먼저 들리도록 설정
        registration.interceptors(stompHandler);
    }
}
