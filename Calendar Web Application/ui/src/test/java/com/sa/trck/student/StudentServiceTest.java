package com.sa.trck.student;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class StudentServiceTest {

  @Autowired
  private StudentService studentService;

  @Test
  void getStudents_shouldReturnAllStudents() {
    assertThat(studentService.getStudents()).hasSize(1);
  }

  @Test
  void getStudentsByEmail_shouldReturnStudentWhenMatchingEmail() {
    assertThat(studentService.getStudentsByEmail("tomas.karnisauskas@devbridge.com")).isNotNull();
  }

  @Test
  void getStudentsByEmail_shouldReturnNothingWhenEmailDoesNotExist() {
    assertThat(studentService.getStudentsByEmail("test@devbridge.com")).isNull();
  }
}
