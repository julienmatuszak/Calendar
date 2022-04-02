package com.sa.trck.utils.exceptionsmanagament.exceptions.team;

import lombok.Getter;

@Getter
public class TeamNotFoundException extends RuntimeException {
  private long id;

  public TeamNotFoundException(Long id) {
    super();
    this.id = id;
  }

}
