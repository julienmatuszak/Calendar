package com.sa.trck.timeofftype;


public class TimeOffTypeNotFoundException extends RuntimeException  {

  public TimeOffTypeNotFoundException() {
  }

  public TimeOffTypeNotFoundException(Long id) {
    super("Could not find time off type with id: " + id);
  }
}
