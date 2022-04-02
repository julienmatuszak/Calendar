package com.sa.trck.timeofftype;

import java.util.List;
import lombok.Value;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Value
@RequestMapping("/time_off_types")
public class TimeOffTypeController {

  TimeOffTypeService timeOffTypeService;

  //For getting all entries in the table
  //Test in browser http://localhost:8080/time_off_types
  @GetMapping
  public List<TimeOffType> getTimeOffTypes() {
    return timeOffTypeService.getTimeOffTypes();
  }

  //For adding new entry to the table
  //for testing purposes you can use this example in terminal:
  //curl -X POST http://localhost:8080/time_off_types -H "Content-type:application/json" -d "{\"id\":2, \"name\": \"Vacation\", \"color\": \"FFC85F\"}"
  @PostMapping
  TimeOffType createTimeOffType(@RequestBody TimeOffType newTimeOffType) {
    return timeOffTypeService.createTimeOffType(newTimeOffType);
  }

  //For getting time off type entry by id
  //Test in browser: http://localhost:8080/time_off_types/1
  @GetMapping("/{id}")
  TimeOffType getTimeOffType(@PathVariable Long id) {
    return timeOffTypeService.getTimeOffType(id);
  }

  //For updating entry by id
  //curl -X PUT http://localhost:8080/time_off_types/2 -H "Content-type:application/json" -d "{\"name\": \"Vacation/Parental leave\", \"color\": \"FFC85F\"}"
  @PutMapping("/{id}")
  TimeOffType updateTimeOffType(@RequestBody TimeOffType newTimeOffType, @PathVariable Long id) {
    return timeOffTypeService.updateTimeOffType(newTimeOffType, id);
  }

  //For deleting entry by id
  //curl -X DELETE http://localhost:8080/time_off_types/2
  @DeleteMapping("/{id}")
  void deleteTimeOffType(@PathVariable Long id) {
    timeOffTypeService.deleteTimeOffType(id);
  }
}
