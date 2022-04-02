package com.sa.trck.security.login.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class CredentialsDto {
  private String email;
  private String password;
}
