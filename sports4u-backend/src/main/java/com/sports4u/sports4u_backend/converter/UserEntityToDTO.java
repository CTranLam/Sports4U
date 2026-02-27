package com.sports4u.sports4u_backend.converter;

import com.sports4u.sports4u_backend.dto.userdto.UserResponseDTO;
import com.sports4u.sports4u_backend.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserEntityToDTO {

    public UserResponseDTO convertToDTO(UserEntity userEntity){
        UserResponseDTO  userResponseDTO = new UserResponseDTO();
        userResponseDTO.setUserId(userEntity.getUserId());
        userResponseDTO.setUserName(userEntity.getEmail());
        if(userEntity.getFullName() != null) {
            userResponseDTO.setFullName(userEntity.getFullName());
        }
        if(userEntity.getPhone() != null) {
            userResponseDTO.setPhone(userEntity.getPhone());
        }
        userResponseDTO.setRole(userEntity.getRole().name());
        userResponseDTO.setStatus(1L);
        if(userEntity.getDetailAddress() != null) {
            userResponseDTO.setDetailAddress(userEntity.getDetailAddress());
        }

        if (userEntity.getProvince() != null) {
            userResponseDTO.setProvinceName(userEntity.getProvince().getName());
        }

        if (userEntity.getWard() != null) {
            userResponseDTO.setWardName(userEntity.getWard().getName());
        }
        return userResponseDTO;
    }
}
