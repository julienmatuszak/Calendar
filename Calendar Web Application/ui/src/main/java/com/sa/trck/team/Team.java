package com.sa.trck.team;

import com.sa.trck.user.User;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Team {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String teamName;
  @JoinTable(
    name = "TEAM_USER",
    joinColumns = @JoinColumn(
      name = "TEAM_ID",
      referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(
      name = "USER_ID",
      referencedColumnName = "id"
    )
  )
  @OneToMany(fetch = FetchType.LAZY)
  private List<User> users;

  public Team(String teamName, List<User> users) {
    this.teamName = teamName;
    this.users = users;
  }

}

