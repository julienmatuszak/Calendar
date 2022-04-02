package com.sa.trck.timeoff;

import com.sa.trck.timeoff.dto.TimeOffDto;
import com.sa.trck.timeoff.repository.TimeOffEntity;
import com.sa.trck.timeoff.dto.TimeOffResponseDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/time_off")
@AllArgsConstructor
public class TimeOffController {

  private final TimeOffService timeOffService;

  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public Long addTimeOff(@RequestBody TimeOffDto timeOffDto) {
    return timeOffService.addTimeOff(timeOffDto);
  }

  @GetMapping
  public List<TimeOffResponseDto> getTimeOffList() {
    return timeOffService.getTimeOffList();
  }

  @GetMapping("/{id}")
  public Optional<TimeOffEntity> getTimeOff(@PathVariable Long id) {
    return timeOffService.getTimeOff(id);
  }

  @DeleteMapping("/{id}")
  public void deleteTimeOff(@PathVariable Long id) {
    timeOffService.deleteTimeOff(id);
  }

  @PutMapping("/{id}")
  TimeOffEntity editTimeOff(@RequestBody TimeOffDto editedTimeOff, @PathVariable Long id) {
    return timeOffService.editTimeOff(editedTimeOff, id);
  }
}
