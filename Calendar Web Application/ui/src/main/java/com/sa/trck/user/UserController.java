package com.sa.trck.user;

import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

  private final UserService userService;

  // Test in terminal "curl localhost:8080/users"
  @GetMapping
  public List<UserNoHashDto> getUsers() {
    return userService.getAllUsers();
  }

  @PostMapping
  @ResponseStatus(code = HttpStatus.CREATED)
  public long addUser(@RequestBody UserPostDto userDto) {
    User user = userService.addUser(userDto);
    return user.getId();
  }

  @DeleteMapping("{id}")
  @ResponseStatus(HttpStatus.OK)
  public void removeUser(@PathVariable Long id) {
    userService.removeUser(id);
  }
}
