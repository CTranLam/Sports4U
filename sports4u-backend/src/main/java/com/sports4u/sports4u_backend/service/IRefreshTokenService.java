package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.entity.RefreshTokenEntity;

import java.util.Optional;

public interface IRefreshTokenService {
    RefreshTokenEntity createRefreshToken(String email);
    Optional<RefreshTokenEntity> findByToken(String token);
    RefreshTokenEntity verifyExpiration(RefreshTokenEntity token);
    void deleteByToken(String token);
    void deleteByEmail(String email);
}
