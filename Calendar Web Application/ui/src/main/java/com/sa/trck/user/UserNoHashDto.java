package com.sa.trck.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for accessing User information without passwordHash
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserNoHashDto {
  private long id;
  private String userName;
  private String email;
}
