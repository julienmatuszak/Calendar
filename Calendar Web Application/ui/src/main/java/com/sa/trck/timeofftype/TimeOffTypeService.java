package com.sa.trck.timeofftype;

import java.util.ArrayList;
import java.util.List;
import com.sa.trck.utils.exceptionsmanagament.exceptions.UniqueConstrainViolation;
import lombok.Value;
import org.springframework.stereotype.Service;

@Service
@Value
public class TimeOffTypeService {

  TimeOffTypeRepository timeOffRepository;

  public List<TimeOffType> getTimeOffTypes() {
    List<TimeOffType> result = new ArrayList<>();
    for (TimeOffType timeOffType : timeOffRepository.findAll()) {
      result.add(timeOffType);
    }
    return result;
  }

  public TimeOffType createTimeOffType(TimeOffType newTimeOffType) {
    if (timeOffRepository.existsByNameEquals(newTimeOffType.getName())) {
      throw new UniqueConstrainViolation("TimeOffType with such name already exist");
    }
    return timeOffRepository.save(newTimeOffType);
  }

  public TimeOffType updateTimeOffType(TimeOffType newTimeOffType, Long id) {
    if (timeOffRepository.existsByNameAndIdIsNot(newTimeOffType.getName(), id)) {
      throw new UniqueConstrainViolation("TimeOffType with such name already exist");
    }
    return timeOffRepository.findById(id)
      .map(timeOffType -> {
        timeOffType.setName(newTimeOffType.getName());
        timeOffType.setColor(newTimeOffType.getColor());
        return timeOffRepository.save(timeOffType);
      })
      .orElseThrow(() -> new TimeOffTypeNotFoundException(id));
  }

  public void deleteTimeOffType(Long id) {
    timeOffRepository.deleteById(id);
  }

  public TimeOffType getTimeOffType(Long id) {
    return timeOffRepository.findById(id)
      .orElseThrow(() -> new TimeOffTypeNotFoundException(id));
  }

  public boolean timeOffTypeExist(Long timeOffTypeId) {
    return timeOffRepository.existsById(timeOffTypeId);
  }
}
