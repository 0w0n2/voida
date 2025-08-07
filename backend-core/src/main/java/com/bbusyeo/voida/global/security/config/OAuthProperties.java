package com.bbusyeo.voida.global.security.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "security.oauth")
public class OAuthProperties {
    String authorizationEndpoint;
    String redirectionEndpoint;
    String clientEndpoint;
}
