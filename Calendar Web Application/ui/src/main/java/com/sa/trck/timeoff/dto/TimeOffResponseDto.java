package com.sa.trck.timeoff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimeOffResponseDto {
  private Long id;
  private String startDate;
  private String endDate;
  private String userName;
  private Long userId;
  private String timeOffTypeName;
  private Long timeOffTypeId;
}
