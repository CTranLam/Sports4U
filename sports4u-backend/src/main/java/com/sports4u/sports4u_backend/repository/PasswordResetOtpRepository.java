package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.PasswordResetOTPEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOTPEntity,Integer> {
    PasswordResetOTPEntity findTopByUser_UserIdAndIsUsedFalseOrderByCreatedAtDesc(Long userId);
}
