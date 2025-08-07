package com.bbusyeo.voida.global.security.service.jwt;

import com.bbusyeo.voida.api.auth.domain.JwtToken;
import com.bbusyeo.voida.global.security.dto.UserDetailsDto;

public interface JwtTokenService {
    JwtToken generateToken(UserDetailsDto userDetails);

    JwtToken reissue(String refreshToken);

    void deleteRefreshToken(String memberUuid);
}
