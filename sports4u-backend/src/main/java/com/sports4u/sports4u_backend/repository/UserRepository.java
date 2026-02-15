package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.UserEntity;
import com.sports4u.sports4u_backend.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Integer> {
    Optional<UserEntity> findByEmail(String userName);
    Boolean existsByEmail(String email);
    Optional<UserEntity> findByUserIdAndStatus(Long id, Long status);

    @Query("""
        SELECT u FROM UserEntity u
        WHERE (:status IS NULL OR u.status = :status)
        AND (:role IS NULL OR u.role = :role)
    """)
    Page<UserEntity> findByStatusAndRole(
            @Param("status") Long status,
            @Param("role") Role role,
            Pageable pageable
    );
}
