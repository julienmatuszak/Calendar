package com.sa.trck.timeoff;

import com.sa.trck.timeoff.dto.TimeOffDto;
import com.sa.trck.timeoff.dto.TimeOffResponseDto;
import com.sa.trck.timeoff.repository.TimeOffEntity;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class TimeOffMapper {

  public TimeOffEntity mapDtoToEntity(TimeOffDto timeOffDto) {
    return TimeOffEntity.builder()
      .userId(timeOffDto.getUserId())
      .timeOffTypeId(timeOffDto.getTimeOffTypeId())
      .startDate(LocalDate.parse(timeOffDto.getStartDate()))
      .endDate(LocalDate.parse(timeOffDto.getEndDate()))
      .build();
  }

  public TimeOffResponseDto mapDaoToTimeOffResponseDto(Object... entity) {
    return TimeOffResponseDto.builder()
      .id((Long) entity[0])
      .startDate(((LocalDate) entity[1]).toString())
      .endDate(((LocalDate) entity[2]).toString())
      .userName((String) entity[3])
      .userId((Long) entity[4])
      .timeOffTypeName((String) entity[5])
      .timeOffTypeId((Long) entity[6])
      .build();
  }
}
