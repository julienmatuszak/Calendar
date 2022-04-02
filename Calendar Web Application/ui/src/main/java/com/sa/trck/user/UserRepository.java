package com.sa.trck.user;

import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface UserRepository extends CrudRepository<User, Long> {
  @Override
  List<User> findAll();

  User findUserById(long id);

  User getUserByEmail(String email);

  User getUserByUserName(String userName);
}
