package com.sports4u.sports4u_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "wards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WardEntity {

    @Id
    @Column(name = "code", length = 20)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_code", nullable = false)
    private ProvinceEntity province;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
