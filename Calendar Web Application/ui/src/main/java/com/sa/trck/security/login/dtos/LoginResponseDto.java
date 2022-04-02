package com.sa.trck.security.login.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class LoginResponseDto {
  private Long userId;
  private String userName;
  private String token;
  private List<String> roles;

}
