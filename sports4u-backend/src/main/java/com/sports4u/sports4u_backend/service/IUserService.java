package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.userdto.*;
import com.sports4u.sports4u_backend.enums.Role;
import com.sports4u.sports4u_backend.utils.PageResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.NoSuchElementException;

public interface IUserService {
    UserRegisterResponseDTO createUser(UserRegisterDTO userRegisterDTO) throws Exception;
    UserResponseDTO findByUsername(String userName) throws Exception;
    String login(String userName, String password) throws Exception;
    Long sendOtp(String email) throws NoSuchElementException;
    boolean verifyOtp(String email, String otp) throws NoSuchElementException;
    void setNewPassword(String email, String newPassword) throws NoSuchElementException;
    void updateUserInfo(String email, UpdateProfileDTO request) throws IllegalArgumentException;
    UserResponseDTO createAccount(UserInAdminDTO requestAdminDTO) throws IllegalArgumentException;
    void updateAccount(Long userId, UserUpdateDTO userUpdateDTO) throws IllegalArgumentException;
    void lockAccount(Long userId) throws IllegalArgumentException;
    PageResponse<UserResponseDTO> getAccounts(Long status, Role role, int page, int size) throws NoSuchElementException;
}
