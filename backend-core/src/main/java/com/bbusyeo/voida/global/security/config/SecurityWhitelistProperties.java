package com.bbusyeo.voida.global.security.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpMethod;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter // yaml 값 바인딩
@ConfigurationProperties(prefix = "security")
public class SecurityWhitelistProperties {
    private Map<String, List<String>> whitelist = new HashMap<>();

    public Map<HttpMethod, List<String>> getParsedWhitelist() {
        Map<HttpMethod, List<String>> parsed = new HashMap<>();
        for (Map.Entry<String, List<String>> entry : whitelist.entrySet()) {
            HttpMethod httpMethod = HttpMethod.valueOf(entry.getKey().toUpperCase());
            parsed.put(httpMethod, entry.getValue());
        }
        return parsed;
    }
}
