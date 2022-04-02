package com.sa.trck.student;

import javax.persistence.Entity;
import javax.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Student {
  @Id
  private Long id;
  private String firstName;
  private String lastName;
  private String email;
}
