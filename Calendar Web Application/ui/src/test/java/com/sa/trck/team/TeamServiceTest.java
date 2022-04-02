package com.sa.trck.team;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.sa.trck.team.dto.TeamDto;
import com.sa.trck.team.dto.TeamPostDto;
import com.sa.trck.user.User;
import com.sa.trck.user.UserNoHashDto;
import com.sa.trck.utils.exceptionsmanagament.exceptions.TrckEntityNotFoundException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.team.TeamExistsException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.team.TeamNotFoundException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.team.UserInAnotherTeamException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
class TeamServiceTest {

  @Autowired
  private TeamService teamService;
  @Autowired
  private TeamRepository teamRepository;

  @Test
  @Transactional
  void getTeams_shouldReturnAllTeams() {
    assertThat(teamService.getAllTeams()).isInstanceOf(List.class);
  }

  @Test
  @Transactional
  void createTeam_shouldReturnEqualTeam() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(7L, 8L, 9L));
    TeamPostDto newTeam = new TeamPostDto("Team Burger", teamUserIds);
    Team addedTeam = teamService.addTeam(newTeam);
    TeamDto retrievedTeam = teamService.getAllTeams().stream()
      .filter((team) -> (team.getId() == addedTeam.getId()))
      .collect(Collectors.toList()).get(0);

    assertThat(retrievedTeam.getId()).isNotEqualTo(-1L);
    assertThat(retrievedTeam.getTeamName()).isEqualTo("Team Burger");

    List<Long> retrievedTeamUserIds = retrievedTeam.getUsers().stream().map((user) -> user.getId())
      .collect(Collectors.toList());

    assertThat(retrievedTeamUserIds).isEqualTo(teamUserIds);
  }

  @Test
  @Transactional
  void createTeamEmpty_shouldReturnEqualTeam() {
    List<Long> teamUserIds = new ArrayList<>();
    TeamPostDto newTeam = new TeamPostDto("Team Burger", teamUserIds);
    Team addedTeam = teamService.addTeam(newTeam);
    TeamDto retrievedTeam = teamService.getAllTeams().stream()
      .filter((team) -> (team.getId() == addedTeam.getId()))
      .collect(Collectors.toList()).get(0);

    assertThat(retrievedTeam.getId()).isNotEqualTo(-1L);
    assertThat(retrievedTeam.getTeamName()).isEqualTo("Team Burger");
    assertThat(retrievedTeam.getUsers()).isEqualTo(new ArrayList<UserNoHashDto>());
  }

  @Test
  @Transactional
  void createExistingTeam_shouldRaiseTeamExistsException() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(7L, 8L, 9L));
    TeamPostDto newTeam = new TeamPostDto("Team Psychology", teamUserIds);
    assertThrows(TeamExistsException.class, () -> teamService.addTeam(newTeam));
  }

  @Test
  @Transactional
  void createTeamWithDuplicates_shouldRaiseUserInAnotherTeamException() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(1L, 2L));
    TeamPostDto newTeam = new TeamPostDto("Team Psychology", teamUserIds);
    assertThrows(UserInAnotherTeamException.class, () -> teamService.addTeam(newTeam));
  }


  @Test
  @Transactional
  void createTeamNonExistentUser_shouldRaiseNullPointerException() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(-2L));
    TeamPostDto newTeam = new TeamPostDto("Team Non-Existent", teamUserIds);
    // trying to add a team with non existent user will create a null pointer exception (as the retrieved user is null)
    assertThrows(NullPointerException.class, () -> teamService.addTeam(newTeam));
  }

  @Test
  @Transactional
  void updateTeam_shouldUpdateNameWhenOnlyNameIsChanged() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(7L, 8L, 9L));
    Team oldTeamRecord = teamService.addTeam(new TeamPostDto("Team Burger", teamUserIds));
    Team updatedTeamRecord = teamService.updateTeam(new TeamPostDto("Team Ice Cream", teamUserIds),
      oldTeamRecord.getId());
    assertThat(updatedTeamRecord.getTeamName()).isEqualTo("Team Ice Cream");
    assertThat(updatedTeamRecord.getUsers()).isEqualTo(oldTeamRecord.getUsers());
    assertThat(updatedTeamRecord.getId()).isEqualTo(oldTeamRecord.getId());
  }

  @Test
  @Transactional
  void updateTeam_shouldUpdateUsersWhenOnlyUsersAreChanged() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(7L, 8L, 9L));
    List<Long> newTeamUserIds = new ArrayList<>(Arrays.asList(7L, 8L));
    Team oldTeamRecord = teamService.addTeam(new TeamPostDto("Team Burger", teamUserIds));
    List<User> newTeamUsers = new ArrayList<>(oldTeamRecord.getUsers());
    //Removing user with id 9
    newTeamUsers.remove(2);
    Team updatedTeamRecord = teamService.updateTeam(new TeamPostDto("Team Burger", newTeamUserIds),
      oldTeamRecord.getId());
    assertThat(updatedTeamRecord.getTeamName()).isEqualTo("Team Burger");
    assertThat(updatedTeamRecord.getUsers()).isEqualTo(newTeamUsers);
    assertThat(updatedTeamRecord.getId()).isEqualTo(oldTeamRecord.getId());
  }

  @Test
  @Transactional
  void updateTeam_shouldUpdateNameAndUsersWhenBothAreChanged() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(7L, 8L, 9L));
    List<Long> newTeamUserIds = new ArrayList<>(Arrays.asList(8L, 9L));
    Team oldTeamRecord = teamService.addTeam(new TeamPostDto("Team Burger", teamUserIds));
    List<User> newTeamUsers = new ArrayList<>(oldTeamRecord.getUsers());
    //Removing user with id 7
    newTeamUsers.remove(0);
    Team updatedTeamRecord = teamService.updateTeam(new TeamPostDto("Team Ice Cream", newTeamUserIds),
      oldTeamRecord.getId());
    assertThat(updatedTeamRecord.getTeamName()).isEqualTo("Team Ice Cream");
    assertThat(updatedTeamRecord.getUsers()).isEqualTo(newTeamUsers);
    assertThat(updatedTeamRecord.getId()).isEqualTo(oldTeamRecord.getId());
  }

  @Test
  @Transactional
  void updateTeam_shouldRaiseTeamNotFoundExceptionWhenInvalidTeamIdIsPassed() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(7L, 8L, 9L));
    TeamPostDto updatedTeam = new TeamPostDto("Team Ice Cream", teamUserIds);
    assertThrows(TeamNotFoundException.class, () -> teamService.updateTeam(updatedTeam, 99));
  }

  @Test
  @Transactional
  void updateTeam_shouldRaiseTeamExistsExceptionWhenTeamNameChangedToExisting() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(7L, 8L, 9L));
    Team oldTeamRecord = teamService.addTeam(new TeamPostDto("Team Burger", teamUserIds));
    TeamPostDto updatedTeam = new TeamPostDto("Team Psychology", teamUserIds);
    assertThrows(TeamExistsException.class, () -> teamService.updateTeam(updatedTeam, oldTeamRecord.getId()));
  }

  @Test
  @Transactional
  void updateTeam_shouldRaiseUserInAnotherTeamExceptionWhenTryingToAddUserFromAnotherTeam() {
    List<Long> teamUserIds = new ArrayList<>(Arrays.asList(7L, 8L, 9L));
    List<Long> newTeamUserIds = new ArrayList<>(Arrays.asList(1L, 7L, 8L, 9L));
    Team oldTeamRecord = teamService.addTeam(new TeamPostDto("Team Burger", teamUserIds));
    TeamPostDto updatedTeam = new TeamPostDto("Team Burger", newTeamUserIds);
    assertThrows(UserInAnotherTeamException.class, () -> teamService.updateTeam(updatedTeam, oldTeamRecord.getId()));
  }

  @Test
  @Transactional
  void deleteTeam_shouldSuccessfullyDeleteTeam() {
    Team newTeam = teamService.addTeam(new TeamPostDto("Winner team", new ArrayList<>(Arrays.asList(7L,8L,9L))));
    Team deletedTeam = teamService.deleteTeam(newTeam.getId());
    assertThat(deletedTeam).isEqualTo(newTeam);
  }

  @Test
  @Transactional
  void deleteTeam_shouldRaiseTeamNotFoundException() {
    assertThrows(TeamNotFoundException.class, () -> teamService.deleteTeam(-1L));
  }

  @Test
  void getTeamNameByTeamId__savedTeamNameMatchesReturned() {
    var team = new Team();
    String teamName = "teamName";
    team.setTeamName(teamName);
    var savedTeam = teamRepository.save(team);

    assertThat(teamService.getTeamNameById(savedTeam.getId())).isEqualTo(teamName);
  }

  @Test
  void getTeamNameByTeamId__invalidId() {
    assertThrows(TrckEntityNotFoundException.class, () -> {
      teamService.getTeamNameById(-1L);
    });
  }

  @Test
  void getTeamNameByTeamId__validIdEntityDoesntExist() {
    assertThrows(TrckEntityNotFoundException.class, () -> {
      teamService.getTeamNameById(Long.MAX_VALUE);
    });
  }
}
