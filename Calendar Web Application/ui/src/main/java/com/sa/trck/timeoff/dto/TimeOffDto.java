package com.sa.trck.timeoff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TimeOffDto {
  private Long timeOffTypeId;
  private Long userId;
  private String startDate;
  private String endDate;
}
