package com.sports4u.sports4u_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterDTO {

    @JsonProperty("email")
    @NotBlank(message = "Email is required")
    private String username;

    @JsonProperty("password")
    @NotBlank(message = "Password is required")
    private String password;

    @JsonProperty("retypePassword")
    @NotBlank(message = "Retype Password is required")
    private String retypedPassword;

}
