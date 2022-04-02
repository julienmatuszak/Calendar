package com.sa.trck.user;

import com.sa.trck.team.TeamService;
import com.sa.trck.utils.exceptionsmanagament.exceptions.EntityDeletionByIdException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.user.EmailNotUniqueException;
import com.sa.trck.utils.exceptionsmanagament.exceptions.user.UserNameNotUniqueException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final TeamService teamService;

  private ModelMapper modelMapper;

  public List<UserNoHashDto> getAllUsers() {

    List<User> users = userRepository.findAll();
    List<UserNoHashDto> userDtos = users.stream().map(this::convertToDto).collect(Collectors.toList());

    return userDtos;
  }

  public User getUserByEmail(String email) {
    return userRepository.getUserByEmail(email);
  }

  public User getUserByUserName(String userName) {
    return userRepository.getUserByUserName(userName);
  }

  public UserNoHashDto getUserById(long id) {
    var user = userRepository.findUserById(id);
    if (user == null) {
      throw new EntityNotFoundException("Entity with such id doesn't exist");
    }
    return convertToDto(user);
  }

  public User addUser(UserPostDto userDto) {
    User user = convertToEntity(userDto);
    if (getUserByUserName(user.getUserName()) != null) {
      throw new UserNameNotUniqueException(user.getUserName());
    }
    if (getUserByEmail(user.getEmail()) != null) {
      throw new EmailNotUniqueException(user.getEmail());
    }
    return userRepository.save(user);
  }

  public void removeUser(Long id) {
    if (id == null || id < 0) {
      throw new EntityDeletionByIdException(String.format("Couldn't delete entity with %d id", id));
    }
    try {
      teamService.removeUserFromTeams(id);
      userRepository.deleteById(id);
    } catch (Exception e) {
      throw (EntityDeletionByIdException) new EntityDeletionByIdException(
        String.format("Couldn't delete entity with %d id", id), e.getCause());
    }
  }

  public boolean userExist(Long userId) {
    return userRepository.existsById(userId);
  }

  private UserNoHashDto convertToDto(User user) {
    return modelMapper.map(user, UserNoHashDto.class);
  }

  private User convertToEntity(UserPostDto userDto) {
    return modelMapper.map(userDto, User.class);
  }

}
