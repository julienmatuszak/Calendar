package com.sa.trck.utils.exceptionsmanagament.exceptions.user;

import lombok.Getter;

@Getter
public class UserNameNotUniqueException extends RuntimeException {

  private String userName;

  public UserNameNotUniqueException(String userName) {
    super();
    this.userName = userName;
  }
}
