package com.bbusyeo.voida.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {

    private static final String BEARER_TOKEN_PREFIX = "Bearer";

    @Value("${swagger.url}")
    private String swaggerUrl;

    @Bean
    OpenAPI openApi() {

        String securityJwtName = "JWT";
        SecurityRequirement securityRequirement =
            new SecurityRequirement().addList(securityJwtName);
        Components components = new Components().addSecuritySchemes(securityJwtName,
            new SecurityScheme().name(securityJwtName).type(SecurityScheme.Type.HTTP)
                .scheme(BEARER_TOKEN_PREFIX).bearerFormat(securityJwtName));

        return new OpenAPI().addSecurityItem(securityRequirement).components(components)
            .addServersItem(new Server().url(swaggerUrl)).info(apiInfo());
    }

    private Info apiInfo() {
        return new Info().title("Bbusyeo - Voida Service").version("v1")
            .description("Voida Test Server API Docs");
    }

}
