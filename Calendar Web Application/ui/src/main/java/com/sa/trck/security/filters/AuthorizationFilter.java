package com.sa.trck.security.filters;

import com.sa.trck.security.token.StupidToken;
import com.sa.trck.utils.exceptionsmanagament.exceptions.login.RequestSecurityTokenException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.HandlerExceptionResolver;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Slf4j
public class AuthorizationFilter implements Filter {

  @Value("#{'${trck.authentication-header.ignored-pathlistpattern}'.split(',')}")
  private List<String> ignoredPaths;

  private final HandlerExceptionResolver exceptionResolver;
  private final StupidToken tokenizer;

  public AuthorizationFilter(HandlerExceptionResolver exceptionResolver,
    StupidToken tokenizer) {
    this.exceptionResolver = exceptionResolver;
    this.tokenizer = tokenizer;
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
    throws IOException, ServletException {
    var castedRequest = (HttpServletRequest) request;
    var castedResponse = (HttpServletResponse) response;
    try {

      if (!ignoredPath(castedRequest)
        && !"OPTIONS".equals(castedRequest.getMethod())) {

        var headers = castedRequest.getHeaders("loginflag");
        String loginFlagHeader = "";
        if (headers.hasMoreElements()) {
          loginFlagHeader = headers.nextElement();
        }

        // super secure token validation
        if (loginFlagHeader.length() == 0 || !tokenizer.validateToken(loginFlagHeader)) {
          throw new RequestSecurityTokenException("Invalid or outdated token");
        }
      }

      chain.doFilter(request, response);
    } catch (Exception ex) {
      if (log.isDebugEnabled()) {
        log.debug("exception: {} , cause: {}", ex.getMessage(), ex.getCause());
      }
      exceptionResolver.resolveException(castedRequest, castedResponse, null, ex);
    }
  }

  private boolean ignoredPath(HttpServletRequest request) {
    var reqPath = request.getServletPath();
    for (var ignoredPath : ignoredPaths) {
      if (reqPath.startsWith(ignoredPath)) {
        return true;
      }
    }
    return false;
  }
}
