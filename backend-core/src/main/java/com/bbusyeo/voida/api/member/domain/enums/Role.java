package com.bbusyeo.voida.api.member.domain.enums;

import lombok.Getter;

@Getter
public enum Role {
    ADMIN("ROLE_ADMIN"),
    USER("ROLE_USER");
    // GUEST("ROLE_NOT_PERMITTED");

    private final String roleName;

    Role(String roleName) {
        this.roleName = roleName;
    }

}
