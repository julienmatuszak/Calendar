package com.sa.trck.timeoff.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TimeOffDao extends JpaRepository<TimeOffEntity, Long> {

  @Query("SELECT t.id AS id, t.startDate AS startDate, t.endDate AS endDate,"
    + " u.userName AS useName, u.id AS userId, tt.name AS timeOffTypeName, tt.id AS timeOffTypeId"
    + " FROM User u, TimeOffEntity t, TimeOffType tt"
    + " WHERE u.id = t.userId AND tt.id = t.timeOffTypeId")
  List<Object[]> getTimeResponseDtoList();

  List<TimeOffEntity> findAllByUserId(Long userId);
}
