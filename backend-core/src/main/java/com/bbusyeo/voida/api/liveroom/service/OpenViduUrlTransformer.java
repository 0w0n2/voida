package com.bbusyeo.voida.api.liveroom.service;

import com.bbusyeo.voida.global.properties.OpenViduWebSocketProperties;
import java.net.URI;
import java.net.URISyntaxException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OpenViduUrlTransformer {

    private final OpenViduWebSocketProperties properties;

    public String transform(String originalUrl) {
        try {
            URI uri = new URI(originalUrl);
            String query = uri.getQuery();

            return String.format("%s://%s%s?%s",
                properties.getScheme(),
                properties.getHost(),
                properties.getPath(),
                query
            );

        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

}

