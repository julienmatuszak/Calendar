package com.sa.trck.security.login;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import com.sa.trck.security.login.dtos.CredentialsDto;
import com.sa.trck.utils.exceptionsmanagament.exceptions.login.LoginAccessDeniedException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LoginServiceTest {

  @Autowired
  private LoginService loginService;

  @Test
  void validateCredentials_userDoestExist() {
    CredentialsDto credentialsDto = CredentialsDto.builder()
      .email("")
      .build();

    assertThatExceptionOfType(LoginAccessDeniedException.class)
      .isThrownBy(() -> loginService.validateCredentials(credentialsDto));
  }

  // TODO: update tests after user table update and creation of encoder bean/component

}
