package com.bbusyeo.voida.api.auth.dto;

import com.bbusyeo.voida.api.auth.domain.enums.enums.ProviderName;
import lombok.*;

@Setter
@Getter
@ToString
@NoArgsConstructor
public class SignUpRequestDto {
    private String email;
    private String password;
    private String nickname;
    private Boolean isSocial;
    private ProviderName providerName;
}
