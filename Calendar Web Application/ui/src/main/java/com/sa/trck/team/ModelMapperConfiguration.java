package com.sa.trck.team;

import com.sa.trck.user.User;
import com.sa.trck.user.UserPostDto;
import lombok.AllArgsConstructor;
import org.modelmapper.Conditions;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@AllArgsConstructor
public class ModelMapperConfiguration {

  @Autowired
  private final PasswordEncoder encoder;

  @Bean
  public ModelMapper modelMapper() {
    ModelMapper modelMapper = new ModelMapper();

    // convert passwords to hashes
    modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
    Converter<String, String> toPasswordHash =
      ctx -> ctx.getSource() == null ? null : encoder.encode(ctx.getSource());
    modelMapper.typeMap(UserPostDto.class, User.class).addMappings(mapper -> {
      mapper.using(toPasswordHash).map(src -> src.getPassword(),
        User::setPasswordHash);
    });
    return modelMapper;
  }
}
