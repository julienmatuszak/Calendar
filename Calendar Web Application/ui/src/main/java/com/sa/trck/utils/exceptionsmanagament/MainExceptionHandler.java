package com.sa.trck.utils.exceptionsmanagament;

import com.sa.trck.timeofftype.TimeOffTypeNotFoundException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.EntitySaveException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.TrckEntityNotFoundException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.UniqueConstrainViolation;
import com.sa.trck.utils.exceptionsmanagament.exceptions.login.LoginAccessDeniedException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.login.RequestSecurityTokenException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.team.TeamExistsException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.team.TeamNotFoundException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.team.UserInAnotherTeamException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.user.EmailNotUniqueException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.user.UserNameNotUniqueException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@Slf4j
public class MainExceptionHandler extends ResponseEntityExceptionHandler {

  private ResponseEntity<ErrorResponse> handle(RuntimeException exception, HttpStatus httpStatus) {
    return handle(exception, httpStatus, null);
  }

  private ResponseEntity<ErrorResponse> handle(
    RuntimeException exception,
    HttpStatus httpStatus,
    Map<String, Object> additionData) {

    if (log.isInfoEnabled()) {
      log.info(exception.getMessage(), exception.getCause());
    }
    return new ResponseEntity<>(
      ErrorResponse.builder()
        .timeStamp(new Date())
        .errorMessage(exception.getMessage())
        .errorCode(httpStatus.value())
        .additionalData(additionData)
        .build(),
      httpStatus
    );
  }

  @ExceptionHandler(LoginAccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleLoginAccessDeniedException(LoginAccessDeniedException exception) {
    return handle(exception, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(RequestSecurityTokenException.class)
  public ResponseEntity<ErrorResponse> handleLoginAccessDeniedException(RequestSecurityTokenException exception) {
    return handle(exception, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(TrckEntityNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleEntityNotFoundException(TrckEntityNotFoundException exception) {
    return handle(exception, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleUncouthExceptions(Exception exception) {
    if (log.isInfoEnabled()) {
      log.info(exception.getMessage(), exception.getCause());
    }

    var body = ErrorResponse.builder()
      .errorMessage("Unrecognized exception occurred")
      .errorCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
      .timeStamp(new Date())
      .build();
    return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(TimeOffTypeNotFoundException.class)
  public ResponseEntity<Object> handleTimeOffTypeNotFoundException(TimeOffTypeNotFoundException ex) {
    return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(EntitySaveException.class)
  public ResponseEntity<ErrorResponse> handleEntitySaveException(EntitySaveException ex) {
    return handle(ex, HttpStatus.BAD_REQUEST);
  }

  // Exceptions related to Team entity
  @ExceptionHandler(TeamExistsException.class)
  public ResponseEntity<ErrorResponse> handleTeamExistsException(TeamExistsException exception) {
    String teamName = exception.getTeamName();
    var msg = "TeamExistsException: Team with name '" + teamName + "' exists in database";
    if (log.isInfoEnabled()) {
      log.info(msg, exception.getCause());
    }

    Map additionalData = new HashMap<String, String>();
    additionalData.put("errorType", "TeamExistsException");
    additionalData.put("teamName", exception.getTeamName());
    var body = ErrorResponse.builder()
      .errorMessage("TeamExistsException: team with the same name exists on server")
      .errorCode(HttpStatus.CONFLICT.value())
      .timeStamp(new Date())
      .additionalData(additionalData)
      .build();
    return new ResponseEntity<>(body, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(UserInAnotherTeamException.class)
  public ResponseEntity<ErrorResponse> handleUserInAnotherTeamException(UserInAnotherTeamException exception) {
    var msg = "UserInAnotherTeamException: users can only be assigned to one team";
    if (log.isInfoEnabled()) {
      log.info(msg, exception.getCause());
    }
    List<String> duplicateUserNames = exception.getDuplicateUserNames();

    Map additionalData = new HashMap<String, Object>();
    additionalData.put("errorType", "UserInAnotherTeamException");
    additionalData.put("duplicateUsers", duplicateUserNames);

    var body = ErrorResponse.builder()
      .errorMessage("UserInAnotherTeamException: users can only be assigned to one team")
      .errorCode(HttpStatus.CONFLICT.value())
      .timeStamp(new Date())
      .additionalData(additionalData)
      .build();
    return new ResponseEntity<>(body, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(TeamNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleTeamNotFoundException(TeamNotFoundException exception) {
    long id = exception.getId();
    var msg = "TeamNotFoundException: Team with id '" + id + "' was not found database";
    if (log.isInfoEnabled()) {
      log.info(msg, exception.getCause());
    }

    Map<String, Object> additionalData = new HashMap<String, Object>();
    additionalData.put("errorType", "TeamNotFoundException");
    additionalData.put("id", exception.getId());
    var body = ErrorResponse.builder()
      .errorMessage("TeamNotFoundException: team was not found")
      .errorCode(HttpStatus.CONFLICT.value())
      .timeStamp(new Date())
      .additionalData(additionalData)
      .build();
    return new ResponseEntity<>(body, HttpStatus.CONFLICT);
  }

  // Exceptions related to User entity
  @ExceptionHandler(UserNameNotUniqueException.class)
  public ResponseEntity<ErrorResponse> handleUserNameNotUniqueException(UserNameNotUniqueException exception) {
    String userName = exception.getUserName();
    var msg = "UserNameNotUniqueException: User name '" + userName + "' exists in the database";
    if (log.isInfoEnabled()) {
      log.info(msg, exception.getCause());
    }

    Map<String, Object> additionalData = new HashMap<String, Object>();
    additionalData.put("errorType", "UserNameNotUniqueException");
    var body = ErrorResponse.builder()
      .errorMessage("UserNameNotUniqueException: user name must be unique")
      .errorCode(HttpStatus.CONFLICT.value())
      .timeStamp(new Date())
      .additionalData(additionalData)
      .build();
    return new ResponseEntity<>(body, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(UniqueConstrainViolation.class)
  public ResponseEntity<ErrorResponse> handleUniqueConstrainViolation(UniqueConstrainViolation exception) {
    return handle(exception, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(EmailNotUniqueException.class)
  public ResponseEntity<ErrorResponse> handleEmailNotUniqueException(EmailNotUniqueException exception) {
    String email = exception.getEmail();
    var msg = "EmailNotUniqueException: User email '" + email + "' exists in the database";
    if (log.isInfoEnabled()) {
      log.info(msg, exception.getCause());
    }

    Map<String, Object> additionalData = new HashMap<String, Object>();
    additionalData.put("errorType", "EmailNotUniqueException");
    var body = ErrorResponse.builder()
      .errorMessage("EmailNotUniqueException: email must be unique")
      .errorCode(HttpStatus.CONFLICT.value())
      .timeStamp(new Date())
      .additionalData(additionalData)
      .build();
    return new ResponseEntity<>(body, HttpStatus.CONFLICT);
  }
}
