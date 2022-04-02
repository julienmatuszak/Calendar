package com.sa.trck.utils.exceptionsmanagament;

import lombok.Builder;
import lombok.Data;
import java.util.Date;
import java.util.Map;

@Data
@Builder
public class ErrorResponse {
  private int errorCode;
  private String errorMessage;
  private Date timeStamp;
  private Map<String, Object> additionalData;
}
