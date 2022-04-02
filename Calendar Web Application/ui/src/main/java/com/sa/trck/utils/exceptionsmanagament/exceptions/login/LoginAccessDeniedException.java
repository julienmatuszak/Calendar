package com.sa.trck.utils.exceptionsmanagament.exceptions.login;

public class LoginAccessDeniedException extends RuntimeException {

  public LoginAccessDeniedException() {
    super();
  }

  public LoginAccessDeniedException(String invalidCredentials) {
    super(invalidCredentials);
  }
}
