package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.UserLoginDTO;
import com.sports4u.sports4u_backend.dto.UserRegisterDTO;
import com.sports4u.sports4u_backend.dto.UserRegisterResponseDTO;
import com.sports4u.sports4u_backend.dto.UserResponseDTO;
import com.sports4u.sports4u_backend.entity.UserEntity;
import com.sports4u.sports4u_backend.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private IUserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDTO userRegisterDTO, BindingResult result) {
        try{
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(Map.of("errors", errorMessages));
            }
            if (!userRegisterDTO.getPassword().equals(userRegisterDTO.getRetypedPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu nhập lại không khớp"));
            }
            UserRegisterResponseDTO userRegisterResponseDTO = userService.createUser(userRegisterDTO);
            Map<String,Object> response = new HashMap<>();
            response.put("message", "Register successfully");
            response.put("username", userRegisterResponseDTO.getUsername());
            response.put("role", userRegisterResponseDTO.getRole());
            return ResponseEntity.ok(response);

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO userDTO, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }

        try {
            UserResponseDTO userResponseDTO = userService.findByUsername(userDTO.getUserName());
            if (userResponseDTO == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Tài khoản không tồn tại"));
            }
            String token = userService.login(userDTO.getUserName(), userDTO.getPassword());
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Sai mật khẩu"));
            }
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đăng nhập thành công");
            response.put("token", token);
            response.put("email", userResponseDTO.getUserName());
            response.put("id", userResponseDTO.getUserId());
            response.put("role", userResponseDTO.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
