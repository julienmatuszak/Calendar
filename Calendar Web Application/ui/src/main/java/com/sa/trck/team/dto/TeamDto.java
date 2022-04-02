package com.sa.trck.team.dto;

import com.sa.trck.user.UserNoHashDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

// DTO for accessing Teams where users are UserNoHashDto
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamDto {
  private long id;
  private String teamName;
  private List<UserNoHashDto> users;
}
