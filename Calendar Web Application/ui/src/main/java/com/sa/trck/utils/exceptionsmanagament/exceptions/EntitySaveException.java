package com.sa.trck.utils.exceptionsmanagament.exceptions;

public class EntitySaveException extends RuntimeException {
  public EntitySaveException() {
    super();
  }

  public EntitySaveException(String message) {
    super(message);
  }

  public EntitySaveException(Exception ex) {
    super(ex.getMessage(), ex.getCause());
  }
}
