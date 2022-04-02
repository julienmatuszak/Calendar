package com.sa.trck.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CustomSecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  private CorsFilter corsFilter;

  @Override
  public void configure(HttpSecurity security) throws Exception {
    security.httpBasic().and()
      .cors().and()
      .csrf().disable()
      .addFilter(corsFilter);

    // TODO: remove after ditching h2 DB
    security.headers().frameOptions().disable();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(4);
  }
}
