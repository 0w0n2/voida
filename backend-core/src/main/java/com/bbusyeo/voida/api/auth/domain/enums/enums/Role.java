package com.bbusyeo.voida.api.auth.domain.enums.enums;

public enum Role {
    ADMIN("ROLE_ADMIN"),
    USER("ROLE_USER");

    private final String role;
    Role(String roleName) { this.role = roleName; }

    public String getRole() { return this.role; }
}
