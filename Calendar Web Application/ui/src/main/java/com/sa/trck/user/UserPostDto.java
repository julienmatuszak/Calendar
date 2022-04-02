package com.sa.trck.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for accepting new user from client
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPostDto {
  private String userName;
  private String email;
  private String password;
}
