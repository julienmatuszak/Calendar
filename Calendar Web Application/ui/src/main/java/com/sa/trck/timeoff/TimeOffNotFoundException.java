package com.sa.trck.timeoff;


public class TimeOffNotFoundException extends RuntimeException  {

  public TimeOffNotFoundException() {
  }

  public TimeOffNotFoundException(Long id) {
    super("Could not find time off " + id);
  }
}
