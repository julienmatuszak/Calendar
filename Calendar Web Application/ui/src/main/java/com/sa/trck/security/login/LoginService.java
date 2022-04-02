package com.sa.trck.security.login;

import com.sa.trck.security.login.dtos.CredentialsDto;
import com.sa.trck.security.login.dtos.LoginResponseDto;
import com.sa.trck.security.token.StupidToken;
import com.sa.trck.user.UserService;
import com.sa.trck.utils.exceptionsmanagament.exceptions.login.LoginAccessDeniedException;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LoginService {

  private final UserService userService;
  private final StupidToken tokenizer;
  private final PasswordEncoder passwordEncoder;

  public LoginResponseDto validateCredentials(CredentialsDto credentials) {
    var user = userService.getUserByEmail(credentials.getEmail());
    if (user == null) {
      throw new LoginAccessDeniedException("Invalid credentials");
    }

    if (passwordEncoder.matches(credentials.getPassword(), user.getPasswordHash())) {
      return LoginResponseDto.builder()
        .userId(user.getId())
        .userName(user.getUserName())
        .token(tokenizer.generateToken())
        .build();
    }
    throw new LoginAccessDeniedException("Invalid credentials");
  }
}
