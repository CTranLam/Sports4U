package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.UserRegisterDTO;
import com.sports4u.sports4u_backend.dto.UserRegisterResponseDTO;
import com.sports4u.sports4u_backend.dto.UserResponseDTO;
import com.sports4u.sports4u_backend.entity.UserEntity;
import com.sports4u.sports4u_backend.exception.NotFoundException;
import com.sports4u.sports4u_backend.repository.UserRepository;
import com.sports4u.sports4u_backend.service.IUserService;
import com.sports4u.sports4u_backend.utils.JwtTokenUtil;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@NoArgsConstructor
@Transactional
public class UserServiceImpl implements IUserService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public UserRegisterResponseDTO createUser(UserRegisterDTO userRegisterDTO) {
        String username = userRegisterDTO.getUsername();
        String password = userRegisterDTO.getPassword();

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(username);
        userEntity.setPassword(passwordEncoder.encode(password));
        userEntity.setRole("ROLE_USER");
        userEntity.setStatus(1);

        userRepository.save(userEntity);

        UserRegisterResponseDTO userRegisterResponseDTO = new UserRegisterResponseDTO();
        userRegisterResponseDTO.setUsername(username);
        userRegisterResponseDTO.setRole("ROLE_USER");
        return userRegisterResponseDTO;
    }

    @Override
    public UserResponseDTO findByUsername(String userName) throws Exception {
        UserEntity userEntity= userRepository.findByEmail(userName)
                .orElseThrow(() -> new Exception("Tài khoản không tồn tại"));
        UserResponseDTO  userResponseDTO = new UserResponseDTO();
        userResponseDTO.setUserId(userEntity.getUserId());
        userResponseDTO.setUserName(userEntity.getEmail());
        userResponseDTO.setPhone(userEntity.getPhone());
        userResponseDTO.setRole(userEntity.getRole());
        userResponseDTO.setStatus(1);
        return userResponseDTO;
    }

    @Override
    public String login(String userName, String password) throws Exception {
        UserEntity userEntity = userRepository.findByEmail(userName)
                .orElseThrow(() -> new NotFoundException("Sai tài khỏan hoặc mật khẩu"));
        // check password
        if(!passwordEncoder.matches(password,userEntity.getPassword())){
            throw new BadCredentialsException("Sai tài khỏan hoặc mật khẩu");
        }

        // load user ==> authentication token luu name, password real va authorities
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userName, password, userEntity.getAuthorities());
        // tim bean authenticationManager de gan UsernamePasswordAuthenticationToken de xac thuc
        authenticationManager.authenticate(authenticationToken);
        // login thanh cong => sinh token
        return jwtTokenUtil.generateToken(userEntity); // token duoc sinh ra se duoc su dung de vao cac api, truoc khi vao cac api dung token vao websecurityConfig de xem quyen
    }


}
