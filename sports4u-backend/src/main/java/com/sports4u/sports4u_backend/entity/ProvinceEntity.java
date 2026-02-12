package com.sports4u.sports4u_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "provinces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProvinceEntity {

    @Id
    @Column(name = "code", nullable = false, length = 20)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "province", fetch = FetchType.LAZY)
    private List<UserEntity> users;

    @OneToMany(mappedBy = "province", fetch = FetchType.LAZY)
    private List<WardEntity> wards;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
