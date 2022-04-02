package com.sa.trck.utils.exceptionsmanagament.exceptions;

public class UniqueConstrainViolation extends RuntimeException {

  public UniqueConstrainViolation() {
    super();
  }

  public UniqueConstrainViolation(String message) {
    super(message);
  }

  public UniqueConstrainViolation(Exception ex) {
    super(ex.getMessage(), ex.getCause());
  }

}
