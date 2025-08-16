package com.bbusyeo.voida.global.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "openvidu.websocket")
public class OpenViduWebSocketProperties {

    private String scheme;
    private String host;
    private String path;

}
