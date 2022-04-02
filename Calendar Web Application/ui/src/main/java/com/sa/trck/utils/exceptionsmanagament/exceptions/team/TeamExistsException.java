package com.sa.trck.utils.exceptionsmanagament.exceptions.team;

import lombok.Getter;

@Getter
public class TeamExistsException extends RuntimeException {
  private String teamName;

  public TeamExistsException(String teamName) {
    super();
    this.teamName = teamName;
  }
}
