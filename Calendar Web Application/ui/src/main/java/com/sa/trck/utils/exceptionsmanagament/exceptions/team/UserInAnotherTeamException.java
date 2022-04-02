package com.sa.trck.utils.exceptionsmanagament.exceptions.team;


import lombok.Getter;
import java.util.List;

@Getter
public class UserInAnotherTeamException extends RuntimeException {
  private List<String> duplicateUserNames;

  public UserInAnotherTeamException(List<String> duplicateUserNames) {
    super();
    this.duplicateUserNames = duplicateUserNames;
  }
}
