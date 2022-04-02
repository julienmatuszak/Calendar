package com.sa.trck.team;

import com.sa.trck.team.dto.UserIdNameDto;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TeamRepository extends CrudRepository<Team, Long> {
  @Override
  List<Team> findAll();

  @Query(value = "SELECT tu.user_id FROM team_user tu", nativeQuery = true)
  List<Long> getAllAssignedUserIds();

  @Query(value = "SELECT tu.user_id FROM team_user tu WHERE NOT tu.team_id=:currentTeamId", nativeQuery = true)
  List<Long> getAllUnavailableUserIds(@Param("currentTeamId") long id);

  @Query(value = "SELECT t.teamName FROM Team t")
  List<String> getAllTeamNames();

  @Query(value = "SELECT t.team_name FROM team t WHERE NOT t.id=:currentTeamId", nativeQuery = true)
  List<String> getAllUnavailableTeamNames(@Param("currentTeamId") long id);

  @Modifying
  @Query(value = "DELETE FROM team_user WHERE user_id = :user_id", nativeQuery = true)
  void removeUserFromTeam(@Param("user_id")Long userId);

  @Query(value = "SELECT u.id AS id, u.user_name AS userName, tu.team_id as teamId, "
    + "FROM user u , team_user AS tu "
    + "WHERE u.id = tu.user_id AND "
    + "tu.team_id = ("
    + "  SELECT team_id "
    + "  FROM team_user "
    + "  WHERE team_user.user_id = :user_id);",
    nativeQuery = true)
  List<UserIdNameDto> getTeamMembersByTeamMemberId(@Param("user_id")Long userId);

  @Query(value = "SELECT t.team_name AS teamName "
    + "FROM team t WHERE t.id = :teamId", nativeQuery = true)
  String getTeamNameById(@Param("teamId")Long teamId);

  @Query(value = "SELECT * FROM team_user WHERE user_id = :userId", nativeQuery = true)
  Long getTeamIdByUserId(@Param("userId") Long userId);
}
