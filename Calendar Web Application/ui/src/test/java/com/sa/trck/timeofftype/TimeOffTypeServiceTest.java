package com.sa.trck.timeofftype;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import com.sa.trck.utils.exceptionsmanagament.exceptions.UniqueConstrainViolation;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class TimeOffTypeServiceTest {


  @Autowired
  private TimeOffTypeService timeOffService;


  @Test
  void getTimeOffTypes_shouldReturnAllTimeOffTypes() {
    assertThat(timeOffService.getTimeOffTypes()).isInstanceOf(List.class);
  }

  @Test
  void createTimeOffType_shouldReturnNewTimeOffType() {
    TimeOffType newTimeOffType = new TimeOffType("Parental leave/Vacation", "FFC85F");
    timeOffService.createTimeOffType(newTimeOffType);
    TimeOffType addedTimeOffType = timeOffService.getTimeOffType(newTimeOffType.getId());
    assertThat(addedTimeOffType.getName()).isEqualTo("Parental leave/Vacation");
    assertThat(addedTimeOffType.getColor()).isEqualTo("FFC85F");
  }

  @Test
  void createTimeOffType_notUniqueNameShouldthrowException() {
    timeOffService.createTimeOffType(new TimeOffType("offType", "FFC85F"));
    assertThrows(UniqueConstrainViolation.class,
      () -> timeOffService.createTimeOffType(new TimeOffType("offType", "FFC85F"))
    );
  }

  @Test
  void updateTimeOffType_shouldReturnUpdatedTimeOffType() {
    TimeOffType timeOffType = timeOffService.createTimeOffType(new TimeOffType("Sick leave", "FF3797"));
    TimeOffType updatedTimeOffType = timeOffService.updateTimeOffType(
      new TimeOffType("Sick leave/Vacation", "FF3797"), timeOffType.getId());
    assertThat(updatedTimeOffType.getName()).isEqualTo("Sick leave/Vacation");
    assertThat(updatedTimeOffType.getColor()).isEqualTo("FF3797");
    assertThat(updatedTimeOffType.getId()).isEqualTo(timeOffType.getId());
  }

  @Test
  void updateTimeOffType_notUniqueName_shouldthrowException() {
    var saved = timeOffService.createTimeOffType(new TimeOffType("timeOffType", "FFC85F"));
    assertThrows(UniqueConstrainViolation.class,
      () -> timeOffService.updateTimeOffType(new TimeOffType("offType", "FFC85F"), saved.getId()));
  }

  @Test
  void updateTimeOffType_shouldReturnNewTypeWhenMissing() {
    Assertions.assertThrows(TimeOffTypeNotFoundException.class, () -> {
      timeOffService.updateTimeOffType(new TimeOffType("Off site work", "404CFA"), 100L);
    });
  }

  @Test
  void deleteTimeOffType() {
    timeOffService.deleteTimeOffType(1L);
    Assertions.assertThrows(TimeOffTypeNotFoundException.class, () -> {
      timeOffService.getTimeOffType(1L);
    });
  }

  @Test
  void one_shouldReturnType() {
    TimeOffType timeOffType = timeOffService.createTimeOffType(new TimeOffType("Team building", "FFFF00"));
    Long id = timeOffType.getId();
    assertThat(timeOffService.getTimeOffType(id).getName()).isEqualTo("Team building");
    assertThat(timeOffService.getTimeOffType(id).getColor()).isEqualTo("FFFF00");
  }

}
