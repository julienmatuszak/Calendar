package com.sa.trck.timeoff;

import com.sa.trck.timeoff.dto.TimeOffDto;
import com.sa.trck.timeoff.dto.TimeOffResponseDto;
import com.sa.trck.timeoff.repository.TimeOffDao;
import com.sa.trck.timeoff.repository.TimeOffEntity;
import com.sa.trck.timeofftype.TimeOffTypeService;
import com.sa.trck.user.UserService;
import com.sa.trck.utils.exceptionsmanagament.exceptions.EntitySaveException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import lombok.Value;
import java.time.LocalDate;

@Value
@Service
@AllArgsConstructor
public class TimeOffService {

  private final TimeOffDao timeOffDao;
  private final TimeOffMapper timeOffMapper;

  private final UserService userService;
  private final TimeOffTypeService timeOffTypeService;

  public Long addTimeOff(TimeOffDto timeOffDto) {
    try {
      if (userService.userExist(timeOffDto.getUserId())
        && timeOffTypeService.timeOffTypeExist(timeOffDto.getTimeOffTypeId())) {

        var mapped = timeOffMapper.mapDtoToEntity(timeOffDto);
        if (mapped.getStartDate().compareTo(mapped.getEndDate()) >= 0) {
          throw new EntitySaveException("Start date is after end date");
        }

        if (!timeOffTimeOverlaps(mapped)) {
          var savedTimeOff = timeOffDao.save(mapped);
          return savedTimeOff.getId();
        } else {
          throw new EntitySaveException("Time off overlaps with other date");
        }
      }
    } catch (Exception ex) {
      throw new EntitySaveException(ex);
    }
    throw new EntitySaveException("Couldn't save time off record");
  }

  private boolean timeOffTimeOverlaps(TimeOffEntity timeOffEntity) {
    var existingTimeOffs = timeOffDao.findAllByUserId(timeOffEntity.getUserId());
    for (var timeOff : existingTimeOffs) {
      if (dateOverlaps(timeOff, timeOffEntity)) {
        return true;
      }
    }
    return false;
  }

  // remove check against it self in edit scenario.
  private boolean timeOffTimeOverlaps(TimeOffEntity timeOffEntity, long id) {
    var existingTimeOffs = timeOffDao.findAllByUserId(timeOffEntity.getUserId());

    for (var timeOff : existingTimeOffs) {
      if (timeOff.getId() != id && dateOverlaps(timeOff, timeOffEntity)) {
        return true;
      }
    }
    return false;
  }

  public List<TimeOffResponseDto> getTimeOffList() {
    return timeOffDao
      .getTimeResponseDtoList().stream()
      .map(timeOffMapper::mapDaoToTimeOffResponseDto)
      .toList();
  }

  private boolean dateOverlaps(TimeOffEntity between, TimeOffEntity timeOffEntity) {
    var from = between.getStartDate();
    var to = between.getEndDate();

    return timeOffEntity.getStartDate().isEqual(from)
      || timeOffEntity.getEndDate().isEqual(to)
      || timeOffEntity.getStartDate().isAfter(from) && timeOffEntity.getStartDate().isBefore(to)
      || timeOffEntity.getEndDate().isAfter(from) && timeOffEntity.getEndDate().isBefore(to);
  }

  public void deleteTimeOff(Long id) {
    timeOffDao.deleteById(id);
  }

  public Optional<TimeOffEntity> getTimeOff(Long id) {
    return timeOffDao.findById(id);
  }

  public TimeOffEntity editTimeOff(TimeOffDto timeOffDto, Long id) {
    if (!timeOffTimeOverlaps(timeOffMapper.mapDtoToEntity(timeOffDto), id)) {
      return timeOffDao.findById(id)
        .map(timeOffEntity -> {

          if (timeOffEntity.getStartDate().compareTo(timeOffEntity.getEndDate()) >= 0) {
            throw new EntitySaveException("Start date is after end date");
          }

          timeOffEntity.setTimeOffTypeId(timeOffDto.getTimeOffTypeId());
          timeOffEntity.setUserId(timeOffDto.getUserId());
          timeOffEntity.setStartDate(LocalDate.parse(timeOffDto.getStartDate()));
          timeOffEntity.setEndDate(LocalDate.parse(timeOffDto.getEndDate()));
          return timeOffDao.save(timeOffEntity);
        })
        .orElseThrow(() -> new TimeOffNotFoundException(id));
    } else {
      throw new EntitySaveException("Time off overlaps with other date");
    }
  }

}
