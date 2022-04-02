package com.sa.trck.security.token;

import org.springframework.stereotype.Component;

@Component
public class StupidToken {

  private static final String SECRET_TOKEN = "e65bes6V4AEGf";

  public String generateToken() {
    return SECRET_TOKEN;
  }

  public boolean validateToken(String compareWith) {
    return SECRET_TOKEN.equals(compareWith);
  }

}
