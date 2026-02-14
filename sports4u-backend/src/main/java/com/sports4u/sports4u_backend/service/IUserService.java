package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.userdto.UpdateProfileDTO;
import com.sports4u.sports4u_backend.dto.userdto.UserRegisterDTO;
import com.sports4u.sports4u_backend.dto.userdto.UserRegisterResponseDTO;
import com.sports4u.sports4u_backend.dto.userdto.UserResponseDTO;

import java.util.NoSuchElementException;

public interface IUserService {
    UserRegisterResponseDTO createUser(UserRegisterDTO userRegisterDTO) throws Exception;
    UserResponseDTO findByUsername(String userName) throws Exception;
    String login(String userName, String password) throws Exception;
    Long sendOtp(String email) throws NoSuchElementException;
    boolean verifyOtp(String email, String otp) throws NoSuchElementException;
    void setNewPassword(String email, String newPassword) throws NoSuchElementException;
    void updateUserInfo(String email, UpdateProfileDTO request) throws IllegalArgumentException;
}
