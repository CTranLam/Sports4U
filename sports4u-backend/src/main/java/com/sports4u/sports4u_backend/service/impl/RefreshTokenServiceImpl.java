package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.entity.RefreshTokenEntity;
import com.sports4u.sports4u_backend.entity.UserEntity;
import com.sports4u.sports4u_backend.repository.RefreshTokenRepository;
import com.sports4u.sports4u_backend.repository.UserRepository;
import com.sports4u.sports4u_backend.service.IRefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements IRefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    // Refresh Token will expire in 7 days
    private static final long REFRESH_TOKEN_VALIDITY_DAYS = 7;

    @Override
    @Transactional
    public RefreshTokenEntity createRefreshToken(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại khi tạo Refresh Token"));

        // Delete existing refresh tokens for the user to implement single session login,
        // or just keep them for multi-device login. Let's delete to make it simpler and secure.
        refreshTokenRepository.deleteByUser(user);

        RefreshTokenEntity refreshToken = RefreshTokenEntity.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plus(REFRESH_TOKEN_VALIDITY_DAYS, ChronoUnit.DAYS))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public Optional<RefreshTokenEntity> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    @Transactional
    public RefreshTokenEntity verifyExpiration(RefreshTokenEntity token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token đã hết hạn. Vui lòng đăng nhập lại.");
        }
        if (token.isRevoked()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token đã bị thu hồi. Vui lòng đăng nhập lại.");
        }
        return token;
    }

    @Override
    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    @Override
    @Transactional
    public void deleteByEmail(String email) {
        userRepository.findByEmail(email).ifPresent(refreshTokenRepository::deleteByUser);
    }
}
