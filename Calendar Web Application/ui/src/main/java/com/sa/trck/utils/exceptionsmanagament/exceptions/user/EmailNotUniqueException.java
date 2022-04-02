package com.sa.trck.utils.exceptionsmanagament.exceptions.user;

import lombok.Getter;

@Getter
public class EmailNotUniqueException extends RuntimeException {
  private String email;

  public EmailNotUniqueException(String email) {
    super();
    this.email = email;
  }
}
