package com.sa.trck.security.login;

import com.sa.trck.security.login.dtos.CredentialsDto;
import com.sa.trck.security.login.dtos.LoginResponseDto;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

  private final LoginService loginService;

  public LoginController(LoginService loginService) {
    this.loginService = loginService;
  }

  @PostMapping("/login")
  public LoginResponseDto login(@RequestBody CredentialsDto credentialsDto) {
    return loginService.validateCredentials(credentialsDto);
  }
}
