package com.sa.trck.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.sa.trck.utils.exceptionsmanagament.exceptions.EntityDeletionByIdException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.user.EmailNotUniqueException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.user.UserNameNotUniqueException;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
class UserServiceTests {

  @Autowired
  private UserRepository userRepository;
  @Autowired
  private UserService userService;
  
  @Autowired
  private PasswordEncoder encoder;
  
  @Test
  void removeUserById_shouldRemoveUser() {
    var user = new User();
    user.setUserName("shouldRemoveUSerName");
    user.setEmail("shouldRemoveUSerNamePW@email.email");
    user.setPasswordHash("shouldRemoveUSerNamePW");

    var expectedSize = userService.getAllUsers().size();
    var savedEntity = userRepository.save(user);

    userService.removeUser(savedEntity.getId());
    assertThat(userService.getAllUsers().size()).isEqualTo(expectedSize);
  }

  @Test
  void removeUserById_shouldThrowException() {
    assertThatExceptionOfType(EntityDeletionByIdException.class)
      .isThrownBy(() -> userService.removeUser(Long.MAX_VALUE));
  }

  @Test
  void removeUserById_negativeId() {
    assertThatExceptionOfType(EntityDeletionByIdException.class)
      .isThrownBy(() -> userService.removeUser(Long.MIN_VALUE));
  }

  // user GET and POST tests
  @Test
  @Transactional
  void getUsers_shouldReturnAllUsers() {
    assertThat(userService.getAllUsers()).isInstanceOf(List.class);
  }

  @Test
  @Transactional
  void createUser_shouldReturnEqualUser() {
    UserPostDto userDto = new UserPostDto("Jon Doe", "jon@doe.com", "admin");
    User newUser = userService.addUser(userDto);
    assertThat(newUser.getId()).isNotEqualTo(-1L);
    assertThat(newUser.getUserName()).isEqualTo("Jon Doe");
    assertThat(newUser.getEmail()).isEqualTo("jon@doe.com");
    assertThat(encoder.matches(newUser.getPasswordHash(), encoder.encode(userDto.getPassword())));
  }


  @Test
  @Transactional
  void createUserWithExistingName_shouldRaiseUserNameNotUniqueException() {
    UserPostDto userDto = new UserPostDto("Jon Doe1", "jon@doe.com1", "admin");
    userService.addUser(userDto);
    userDto.setEmail("uniqueemail@gmail.com");
    assertThrows(UserNameNotUniqueException.class, () -> userService.addUser(userDto));
  }

  @Test
  @Transactional
  void createUserWithExistingEmail_shouldRaiseEmailNotUniqueException() {
    UserPostDto userDto = new UserPostDto("Jon Doe2", "jon@doe.com2", "admin");
    userService.addUser(userDto);
    userDto.setUserName("Unique Username");
    assertThrows(EmailNotUniqueException.class, () -> userService.addUser(userDto));
  }
}
