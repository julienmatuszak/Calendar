package com.sa.trck.student;

import java.util.ArrayList;
import java.util.List;
import lombok.Value;
import org.springframework.stereotype.Service;

@Service
@Value
public class StudentService {

  StudentRepository studentRepository;

  public List<Student> getStudents() {
    List<Student> result = new ArrayList<>();
    for (Student student : studentRepository.findAll()) {
      result.add(student);
    }
    return result;
  }

  public Student getStudentsByEmail(String email) {
    return studentRepository.findStudentByEmail(email).orElse(null);
  }
}
