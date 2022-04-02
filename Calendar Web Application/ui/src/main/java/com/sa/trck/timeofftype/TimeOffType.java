package com.sa.trck.timeofftype;


import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "time_off_types")
public class TimeOffType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private String color;

  public TimeOffType() {
  }

  //Needed when creating new type without id (id is then automatically generated)
  public TimeOffType(String name, String color) {
    this.name = name;
    this.color = color;
  }

  @Override
  public boolean equals(Object o) {

    if (this == o) {
      return true;
    }
    if (!(o instanceof TimeOffType timeOffType)) {
      return false;
    }
    return Objects.equals(this.id, timeOffType.id) && Objects.equals(this.name, timeOffType.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.id, this.name);
  }

  @Override
  public String toString() {
    return "Time off type{" + "id=" + this.id + ", name='" + this.name + '\'' + ", color=#" + this.color + '\'' + '}';
  }


}
