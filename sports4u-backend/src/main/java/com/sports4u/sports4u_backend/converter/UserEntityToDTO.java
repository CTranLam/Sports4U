package com.sports4u.sports4u_backend.converter;

import com.sports4u.sports4u_backend.dto.UserResponseDTO;
import com.sports4u.sports4u_backend.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserEntityToDTO {

    public UserResponseDTO convertToDTO(UserEntity userEntity){
        UserResponseDTO  userResponseDTO = new UserResponseDTO();
        userResponseDTO.setUserId(userEntity.getUserId());
        userResponseDTO.setUserName(userEntity.getEmail());
        userResponseDTO.setFullName(userEntity.getFullName());
        userResponseDTO.setPhone(userEntity.getPhone());
        userResponseDTO.setRole(userEntity.getRole());
        userResponseDTO.setStatus(1L);
        userResponseDTO.setDetailAddress(userEntity.getDetailAddress());
        userResponseDTO.setPrivinceName(userEntity.getProvince().getName());
        userResponseDTO.setWardName(userEntity.getWard().getName());
        return userResponseDTO;
    }
}
