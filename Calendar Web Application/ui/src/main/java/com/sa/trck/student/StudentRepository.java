package com.sa.trck.student;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface StudentRepository extends CrudRepository<Student, Long> {

  Optional<Student> findStudentByEmail(String email);
}
