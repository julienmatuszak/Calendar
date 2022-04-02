package com.sa.trck.student;

import java.util.List;
import lombok.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Value
@RequestMapping("/students")
public class StudentsController {

  StudentService studentService;

  @GetMapping
  public List<Student> getStudents(@RequestParam(required = false) String email) {
    if (email == null) {
      return studentService.getStudents();
    } else {
      var student = studentService.getStudentsByEmail(email);
      return student == null ? List.of() : List.of(student);
    }
  }
}
