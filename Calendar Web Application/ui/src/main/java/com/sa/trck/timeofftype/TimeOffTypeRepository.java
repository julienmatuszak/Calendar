package com.sa.trck.timeofftype;

import org.springframework.data.repository.CrudRepository;

public interface TimeOffTypeRepository extends CrudRepository<TimeOffType, Long> {
  boolean existsByNameEquals(String name);

  boolean existsByNameAndIdIsNot(String name, Long id);
}
