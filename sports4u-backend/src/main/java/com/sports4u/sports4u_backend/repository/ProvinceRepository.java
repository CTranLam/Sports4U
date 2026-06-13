package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.ProvinceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvinceRepository extends JpaRepository<ProvinceEntity, String> {

}
