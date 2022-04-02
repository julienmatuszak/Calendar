package com.sa.trck.utils.exceptionsmanagament.exceptions;

public class TrckEntityNotFoundException extends RuntimeException {
  public TrckEntityNotFoundException() {
    super();
  }

  public TrckEntityNotFoundException(String message) {
    super(message);
  }

  public TrckEntityNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

}
