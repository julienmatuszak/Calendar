package com.sa.trck.team.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamDto2 {
  private Long id;
  private String teamName;
  private List<UserIdNameDto> users;
}
