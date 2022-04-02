package com.sa.trck.utils.exceptionsmanagament.exceptions.login;

public class RequestSecurityTokenException extends RuntimeException {

  public RequestSecurityTokenException(String message) {
    super(message);
  }

  public RequestSecurityTokenException() {
    super();
  }
}
