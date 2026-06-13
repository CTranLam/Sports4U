package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.WardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WardRepository extends JpaRepository<WardEntity, String> {
    List<WardEntity> findByProvince_CodeOrderByNameAsc(String provinceCode);
}
