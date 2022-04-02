package com.sa.trck.team;

import java.util.List;
import com.sa.trck.team.dto.TeamDto;
import com.sa.trck.team.dto.TeamDto2;
import com.sa.trck.team.dto.TeamPostDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams")
@AllArgsConstructor
public class TeamController {

  private final TeamService teamService;

  @GetMapping
  public List<TeamDto> getTeams() {
    return teamService.getAllTeams();
  }

  @PostMapping
  @ResponseStatus(code = HttpStatus.CREATED)
  public long addTeam(@RequestBody TeamPostDto teamDto) {
    Team team = teamService.addTeam(teamDto);
    return team.getId();
  }

  @PutMapping("/{id}")
  @ResponseStatus(code = HttpStatus.OK)
  public Team updateTeam(@RequestBody TeamPostDto teamDto, @PathVariable Long id) {
    return teamService.updateTeam(teamDto, id);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(code = HttpStatus.OK)
  public long deleteTeam(@PathVariable Long id) {
    return teamService.deleteTeam(id).getId();
  }

  @GetMapping("/user/{id}")
  public TeamDto2 getTeamByTeamMemberId(@PathVariable Long id) {
    return teamService.getTeamByTeamMemberId(id);
  }
}

