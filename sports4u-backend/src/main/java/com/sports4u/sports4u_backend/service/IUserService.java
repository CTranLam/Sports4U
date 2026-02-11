package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.UserRegisterDTO;
import com.sports4u.sports4u_backend.dto.UserRegisterResponseDTO;
import com.sports4u.sports4u_backend.dto.UserResponseDTO;
import com.sports4u.sports4u_backend.entity.UserEntity;

public interface IUserService {
    UserRegisterResponseDTO createUser(UserRegisterDTO userRegisterDTO) throws Exception;
    UserResponseDTO findByUsername(String userName) throws Exception;
    String login(String userName, String password) throws Exception;
    Long sendOtp(String email);
    boolean verifyOtp(String email, String otp);
    void setNewPassword(String email, String newPassword);
}
