package com.sa.trck.timeoff;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import com.sa.trck.timeoff.dto.TimeOffDto;
import com.sa.trck.timeofftype.TimeOffType;
import com.sa.trck.timeofftype.TimeOffTypeRepository;
import com.sa.trck.user.User;
import com.sa.trck.user.UserRepository;
import com.sa.trck.utils.exceptionsmanagament.exceptions.EntitySaveException;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import com.sa.trck.timeoff.repository.TimeOffEntity;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;


@SpringBootTest
@TestInstance(Lifecycle.PER_CLASS)
class TimeOffServiceTest {

  @Autowired
  private TimeOffService timeOffService;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private TimeOffTypeRepository timeOffTypeRepository;

  private User user = null;
  private TimeOffType timeOffType = null;

  @BeforeAll
  void init() {
    user = new User();
    user.setPasswordHash("hash");
    user.setEmail("email@email.email");
    user.setUserName("userName");
    user = userRepository.save(user);

    timeOffType = new TimeOffType();
    timeOffType.setColor("ffffff");
    timeOffType.setName("Some Name");
    timeOffType = timeOffTypeRepository.save(timeOffType);
  }

  @Test
  void createNewRecord_allGood() {
    TimeOffDto timeOffDto = TimeOffDto.builder()
      .userId(user.getId())
      .startDate(LocalDate.now().toString())
      .endDate(LocalDate.now().plusDays(15).toString())
      .timeOffTypeId(timeOffType.getId())
      .build();

    assertThat(timeOffService.addTimeOff(timeOffDto)).isPositive();
  }

  @Test
  void createNewRecord_userDoesntExist() {
    TimeOffDto timeOffDto = TimeOffDto.builder()
      .userId(Long.MAX_VALUE)
      .startDate(LocalDate.now().toString())
      .endDate(LocalDate.now().plusDays(15).toString())
      .timeOffTypeId(timeOffType.getId())
      .build();

    assertThatExceptionOfType(EntitySaveException.class)
      .isThrownBy(() -> timeOffService.addTimeOff(timeOffDto));
  }

  @Test
  void createNewRecord_endDateBeforeStartDate() {
    TimeOffDto timeOffDto = TimeOffDto.builder()
      .userId(Long.MAX_VALUE)
      .startDate(LocalDate.now().toString())
      .endDate(LocalDate.now().minusDays(15).toString())
      .timeOffTypeId(timeOffType.getId())
      .build();

    assertThatExceptionOfType(EntitySaveException.class)
      .isThrownBy(() -> timeOffService.addTimeOff(timeOffDto));
  }

  @Test
  void createNewRecord_startDateEqualToEndDate() {
    TimeOffDto timeOffDto = TimeOffDto.builder()
      .userId(Long.MAX_VALUE)
      .startDate(LocalDate.now().toString())
      .endDate(LocalDate.now().toString())
      .timeOffTypeId(timeOffType.getId())
      .build();

    assertThatExceptionOfType(EntitySaveException.class)
      .isThrownBy(() -> timeOffService.addTimeOff(timeOffDto));
  }

  @Test
  void createNewRecord_timeOffDoesntExist() {
    TimeOffDto timeOffDto = TimeOffDto.builder()
      .userId(user.getId())
      .startDate(LocalDate.now().toString())
      .endDate(LocalDate.now().plusDays(15).toString())
      .timeOffTypeId(Long.MAX_VALUE)
      .build();

    assertThatExceptionOfType(EntitySaveException.class)
      .isThrownBy(() -> timeOffService.addTimeOff(timeOffDto));
  }

  @Test
  void createNewRecord_dateOverLaps() {
    TimeOffDto timeOffDto = TimeOffDto.builder()
      .userId(user.getId())
      .startDate(LocalDate.now().plusDays(1).toString())
      .endDate(LocalDate.now().plusDays(15).toString())
      .timeOffTypeId(Long.MAX_VALUE)
      .build();

    assertThatExceptionOfType(EntitySaveException.class)
      .isThrownBy(() -> timeOffService.addTimeOff(timeOffDto));
  }

  @Test
  void getTimeOff_shouldReturnAllTimeOffs() {
    assertThat(timeOffService.getTimeOffList()).isInstanceOf(List.class);
  }

  @Test
  @Transactional
  void deleteTimeOff_shouldDeleteTimeOff() {
    TimeOffDto newTimeOff = TimeOffDto.builder()
      .userId(user.getId())
      .startDate(LocalDate.now().toString())
      .endDate(LocalDate.now().plusDays(15).toString())
      .timeOffTypeId(timeOffType.getId())
      .build();
    Long id = timeOffService.addTimeOff(newTimeOff);
    timeOffService.deleteTimeOff(id);
    Optional<TimeOffEntity> deletedTimeOff = timeOffService.getTimeOff(id);
    assertThat(deletedTimeOff).isEmpty();
  }

  @Test
  @Transactional
  void editTimeOff_shouldEditTimeOff() {
    TimeOffDto timeOff = TimeOffDto.builder()
      .userId(user.getId())
      .startDate(LocalDate.now().toString())
      .endDate(LocalDate.now().plusDays(5).toString())
      .timeOffTypeId(timeOffType.getId())
      .build();
    TimeOffType editedTimeOffType = new TimeOffType("Some Other Name", "FFFFFE");
    Long id = timeOffService.addTimeOff(timeOff);
    timeOffService.editTimeOff(
      TimeOffDto.builder()
      .userId(user.getId())
      .startDate(LocalDate.now().plusDays(6).toString())
      .endDate(LocalDate.now().plusDays(10).toString())
      .timeOffTypeId(editedTimeOffType.getId())
      .build(), 
      id
    );
    Optional<TimeOffEntity> editedTimeOff = timeOffService.getTimeOff(id);
    assertThat(editedTimeOff.get().getStartDate()).isEqualTo(LocalDate.now().plusDays(6).toString());
    assertThat(editedTimeOff.get().getEndDate()).isEqualTo(LocalDate.now().plusDays(10).toString());
    assertThat(editedTimeOff.get().getTimeOffTypeId()).isEqualTo(editedTimeOffType.getId());
  }

  @Test
  void editTimeOff_timeOffNotFound() {
    TimeOffDto newTimeOff = TimeOffDto.builder()
      .userId(user.getId())
      .startDate(LocalDate.now().toString())
      .endDate(LocalDate.now().plusDays(15).toString())
      .timeOffTypeId(timeOffType.getId())
      .build();
    Assertions.assertThrows(TimeOffNotFoundException.class, () -> {
      timeOffService.editTimeOff(newTimeOff, 100L);
    });
  }

  @Test
  void editTimeOff_timeOffEndDateBeforeStartDate() {
    TimeOffDto newTimeOff = TimeOffDto.builder()
      .userId(user.getId())
      .startDate(LocalDate.now().toString())
      .endDate(LocalDate.now().minusDays(15).toString())
      .timeOffTypeId(timeOffType.getId())
      .build();
    Assertions.assertThrows(TimeOffNotFoundException.class, () -> {
      timeOffService.editTimeOff(newTimeOff, 100L);
    });
  }

}
