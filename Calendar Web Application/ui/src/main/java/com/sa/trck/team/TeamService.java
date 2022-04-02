package com.sa.trck.team;

import com.sa.trck.team.dto.TeamDto;
import com.sa.trck.team.dto.TeamDto2;
import com.sa.trck.team.dto.TeamPostDto;
import com.sa.trck.user.User;
import com.sa.trck.user.UserRepository;
import com.sa.trck.utils.exceptionsmanagament.exceptions.TrckEntityNotFoundException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.team.TeamExistsException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.team.TeamNotFoundException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.team.UserInAnotherTeamException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TeamService {

  @Autowired
  private ModelMapper modelMapper;
  private final TeamRepository teamRepository;
  private final UserRepository userRepository;

  public List<TeamDto> getAllTeams() {
    List<Team> allTeams = teamRepository.findAll();
    List<TeamDto> allTeamDtos = allTeams.stream()
      .map(this::convertToDto)
      .collect(Collectors.toList());
    return allTeamDtos;
  }

  public Team addTeam(TeamPostDto teamDto) {
    Team newTeam = convertToEntity(teamDto);
    List<User> duplicateAssignments = checkDuplicateUserTeamAssignments(newTeam);

    Set<String> teamNames = new HashSet<>(teamRepository.getAllTeamNames());
    String teamName = newTeam.getTeamName();

    if (!duplicateAssignments.isEmpty()) {
      List<String> duplicateUserNames = duplicateAssignments.stream()
        .map(user -> user.getUserName())
        .collect(Collectors.toList());
      throw new UserInAnotherTeamException(duplicateUserNames);
    } else if (teamNames.contains(teamName)) {
      throw new TeamExistsException(teamName);
    } else {
      return teamRepository.save(newTeam);
    }
  }

  @Transactional
  public Team deleteTeam(long id) {
    Team team = teamRepository.findById(id).orElseThrow(() -> new TeamNotFoundException(id));
    for (User user: team.getUsers()) {
      teamRepository.removeUserFromTeam(user.getId());
    }
    teamRepository.delete(team);
    return team;
  }

  public Team updateTeam(TeamPostDto teamDto, long id) {
    Team updatedTeam = convertToEntity(teamDto);
    List<User> duplicateAssignments = checkUserAvailabilityForUpdate(updatedTeam, id);

    if (!duplicateAssignments.isEmpty()) {
      List<String> duplicateUserNames = duplicateAssignments.stream()
        .map(user -> user.getUserName())
        .collect(Collectors.toList());
      throw new UserInAnotherTeamException(duplicateUserNames);
    } else if (hasDuplicateName(updatedTeam.getTeamName(), id)) {
      throw new TeamExistsException(updatedTeam.getTeamName());
    } else {
      return teamRepository.findById(id)
        .map(team -> {
          team.setTeamName(updatedTeam.getTeamName());
          team.setUsers(updatedTeam.getUsers());
          return teamRepository.save(team);
        })
        .orElseThrow(() -> new TeamNotFoundException(id));
    }
  }

  private List<User> checkDuplicateUserTeamAssignments(Team team) {
    Set<Long> assignedUserIdSet = new HashSet<>(teamRepository.getAllAssignedUserIds());
    List<User> candidates = team.getUsers();
    List<User> duplicates = candidates.stream()
      .filter(user -> assignedUserIdSet.contains(user.getId()))
      .collect(Collectors.toList()
      );
    return duplicates;
  }

  private List<User> checkUserAvailabilityForUpdate(Team team, long id) {
    List<Long> unAvailableUserIds = new ArrayList<>(teamRepository.getAllUnavailableUserIds(id));
    List<User> candidates = team.getUsers();
    return candidates.stream()
      .filter(user -> unAvailableUserIds.contains(user.getId()))
      .collect(Collectors.toList()
      );
  }

  private boolean hasDuplicateName(String teamName, Long id) {
    Set<String> teamNames = new HashSet<>(teamRepository.getAllUnavailableTeamNames(id));
    return teamNames.contains(teamName);
  }

  private TeamDto convertToDto(Team team) {
    return modelMapper.map(team, TeamDto.class);
  }

  private Team convertToEntity(TeamPostDto teamDto) {
    Team team = modelMapper.map(teamDto, Team.class);
    List<User> teamUsers = teamDto.getMemberIds().stream()
      .map(user -> userRepository.findUserById(user))
      .collect(Collectors.toList());
    team.setUsers(teamUsers);
    return team;
  }

  @Transactional
  public void removeUserFromTeams(Long id) {
    teamRepository.removeUserFromTeam(id);
  }

  @Transactional
  public TeamDto2 getTeamByTeamMemberId(Long userId) {
    //User can be in a team with no members
    Long teamId = teamRepository.getTeamIdByUserId(userId);
    //User is in a team
    if (teamId != null) {
      var teamsMembers = teamRepository.getTeamMembersByTeamMemberId(userId);
      return TeamDto2.builder()
        .id(teamId)
        .teamName(getTeamNameById(teamId))
        .users(teamsMembers)
        .build();
    } else {
      return null;
    }
  }

  @Transactional
  public String getTeamNameById(Long teamId) {
    if (teamId != null && teamId > -1 && teamRepository.existsById(teamId)) {
      return teamRepository.getTeamNameById(teamId);
    }
    throw new TrckEntityNotFoundException(String.format("Team with such id:%d doesn't exist", teamId));
  }
}
