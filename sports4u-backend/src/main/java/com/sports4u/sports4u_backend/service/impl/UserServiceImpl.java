package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.EmailMessageDTO;
import com.sports4u.sports4u_backend.dto.UserRegisterDTO;
import com.sports4u.sports4u_backend.dto.UserRegisterResponseDTO;
import com.sports4u.sports4u_backend.dto.UserResponseDTO;
import com.sports4u.sports4u_backend.entity.PasswordResetOTPEntity;
import com.sports4u.sports4u_backend.entity.UserEntity;
import com.sports4u.sports4u_backend.exception.NotFoundException;
import com.sports4u.sports4u_backend.repository.PasswordResetOtpRepository;
import com.sports4u.sports4u_backend.repository.UserRepository;
import com.sports4u.sports4u_backend.service.IUserService;
import com.sports4u.sports4u_backend.service.RabbitMQService.EmailConsumerService;
import com.sports4u.sports4u_backend.service.RabbitMQService.EmailProducerService;
import com.sports4u.sports4u_backend.utils.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements IUserService {
    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final JwtTokenUtil jwtTokenUtil;

    private final PasswordResetOtpRepository passwordResetOtpRepository;

    private final EmailProducerService emailProducerService;

    @Override
    public UserRegisterResponseDTO createUser(UserRegisterDTO userRegisterDTO) {
        String username = userRegisterDTO.getUsername();
        String password = userRegisterDTO.getPassword();

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(username);
        userEntity.setPassword(passwordEncoder.encode(password));
        userEntity.setRole("ROLE_USER");
        userEntity.setStatus(1L);

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
        userResponseDTO.setStatus(1L);
        return userResponseDTO;
    }

    @Override
    public String login(String userName, String password) throws Exception {
        UserEntity userEntity = userRepository.findByEmail(userName)
                .orElseThrow(() -> new NotFoundException("Sai tài khỏan hoặc mật khẩu"));
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

    @Transactional
    @Override
    public void sendOtp(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Email không tồn tại"));

        String otp = String.valueOf(new Random().nextInt(999999));

        PasswordResetOTPEntity otpEntity = new PasswordResetOTPEntity();
        otpEntity.setUser(user);
        otpEntity.setOtpCode(otp);
        otpEntity.setExpirationTime(LocalDateTime.now().plusMinutes(3));
        passwordResetOtpRepository.save(otpEntity);

        EmailMessageDTO emailMessageDTO = new EmailMessageDTO(
                email,
                "Mã OTP đặt lại mật khẩu",
                "OTP của bạn là: "+otp
        );

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCommit() {
                emailProducerService.sendEmailAsync(emailMessageDTO);
            }
        });
//        emailProducerService.sendEmailAsync(emailMessageDTO);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Email không tồn tại"));
        PasswordResetOTPEntity entity = passwordResetOtpRepository.findTopByUser_UserIdAndIsUsedFalseOrderByCreatedAtDesc(userEntity.getUserId());
        if (entity == null) return false;
        if (!entity.getOtpCode().equals(otp)) return false;
        if (entity.getExpirationTime().isBefore(LocalDateTime.now())) return false;
        entity.setIsUsed(true);
        passwordResetOtpRepository.save(entity);
        return true;
    }

    @Override
    public void setNewPassword(String email, String newPassword){
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Email không tồn tại trong hệ thống."));

        userEntity.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userEntity);
    }
}
