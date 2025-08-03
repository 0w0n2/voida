package com.bbusyeo.voida.api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Getter
@NoArgsConstructor
public class ResetPasswordRequestDto {

    @Email
    @NotBlank
    private String email;

}
