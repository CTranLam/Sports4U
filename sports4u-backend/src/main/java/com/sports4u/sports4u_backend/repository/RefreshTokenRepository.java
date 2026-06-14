package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.RefreshTokenEntity;
import com.sports4u.sports4u_backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {

    Optional<RefreshTokenEntity> findByToken(String token);

    @Modifying
    void deleteByUser(UserEntity user);

    @Modifying
    void deleteByToken(String token);
}
