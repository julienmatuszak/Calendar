package com.sa.trck.team.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for accepting new team from client
// And for updating existing team
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamPostDto {
  private String teamName;
  private List<Long> memberIds;
}
