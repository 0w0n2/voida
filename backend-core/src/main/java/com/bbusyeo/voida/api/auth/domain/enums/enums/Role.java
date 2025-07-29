package com.bbusyeo.voida.api.auth.domain.enums.enums;

public enum Role {
    ADMIN("ROLE_ADMIN"),
    USER("ROLE_USER");
    // GUEST("ROLE_NOT_PERMITTED");

    private final String roleName;

    Role(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return this.roleName;
    }
}
