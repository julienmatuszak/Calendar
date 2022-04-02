package com.sa.trck.utils.exceptionsmanagament.exceptions;

public class EntityDeletionByIdException extends RuntimeException {
  public EntityDeletionByIdException() {
    super();
  }

  public EntityDeletionByIdException(String message) {
    super(message);
  }

  public EntityDeletionByIdException(String message, Throwable cause) {
    super(message, cause);
  }

}
