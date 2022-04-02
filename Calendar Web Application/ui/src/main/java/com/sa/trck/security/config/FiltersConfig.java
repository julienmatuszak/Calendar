package com.sa.trck.security.config;

import com.sa.trck.security.filters.AuthorizationFilter;
import com.sa.trck.security.token.StupidToken;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Configuration
public class FiltersConfig {

  private final HandlerExceptionResolver  exceptionResolver;
  private final StupidToken tokenizer;

  public FiltersConfig(@Qualifier("handlerExceptionResolver") HandlerExceptionResolver exceptionResolver,
    StupidToken tokenizer) {
    this.exceptionResolver = exceptionResolver;
    this.tokenizer = tokenizer;
  }

  @Bean
  public FilterRegistrationBean<AuthorizationFilter> registerAuthorizationFilter() {
    var registration = new FilterRegistrationBean<AuthorizationFilter>();
    registration.setFilter(getCustomAuthorizationFilter());
    registration.addUrlPatterns("/*");
    registration.setName("customAuthorizationHeaderFilter");
    registration.setOrder(0);
    return registration;
  }

  @Bean
  public AuthorizationFilter getCustomAuthorizationFilter() {
    return new AuthorizationFilter(exceptionResolver, tokenizer);
  }
}
